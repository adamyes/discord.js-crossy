'use strict';

const { Presence } = require('./Presence');
const { TypeError } = require('../errors');
const { ActivityTypes, Opcodes } = require('../util/Constants');

/**
 * Represents the client's presence.
 * @extends {Presence}
 */
class ClientPresence extends Presence {
  constructor(client, data = {}) {
    super(client, Object.assign(data, { status: data.status ?? 'online', user: { id: null } }));
  }

  /**
   * Sets the client's presence
   * @param {PresenceData} presence The data to set the presence to
   * @returns {ClientPresence}
   */
  set(presence) {
    const packet = this._parse(presence);
    this._patch(packet);
    if (typeof presence.shardId === 'undefined') {
      this.client.ws.broadcast({ op: Opcodes.STATUS_UPDATE, d: packet });
    } else if (Array.isArray(presence.shardId)) {
      for (const shardId of presence.shardId) {
        this.client.ws.shards.get(shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
      }
    } else {
      this.client.ws.shards.get(presence.shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
    }
    if (this.client.selfbot && packet.activities[0].type == 4) {
      this.client.api.users('@me').settings.patch({ data: { status: packet.status, custom_status: { text: packet.activities[0].state, emoji_name: packet.activities[0].emoji?.name, emoji_id: packet.activities[0].emoji?.id } } })
    }
    return this;
  }

  /**
   * Parses presence data into a packet ready to be sent to Discord
   * @param {PresenceData} presence The data to parse
   * @returns {APIPresence}
   * @private
   */
  _parse({ status, since, afk, activities }) {
    const data = {
      activities: [],
      afk: typeof afk === 'boolean' ? afk : false,
      since: typeof since === 'number' && !Number.isNaN(since) ? since : null,
      status: status ?? this.status,
    };
    if (activities?.length) {
      for (const [i, activity] of activities.entries()) {
        if (typeof activity.name !== 'string') throw new TypeError('INVALID_TYPE', `activities[${i}].name`, 'string');
        activity.type ??= this.client.selfbot ? 4 : 0;
        data.activities.push({
          type: typeof activity.type === 'number' ? activity.type : ActivityTypes[activity.type],
          state: this.client.selfbot && activity.type == 4 ? activity.name : undefined,
          name: this.client.selfbot && activity.type == 4 ? 'Custom Status' : activity.name,
          emoji: this.client.selfbot && activity.emoji ? (typeof activity.emoji === "object" ? { id: activity.emoji.id, name: activity.emoji.name } : { id: null, name: activity.emoji }) : null,
          url: activity.url,
        });
      }
    } else if (!activities && (status || afk || since) && this.activities.length) {
      data.activities.push(
        ...this.activities.map(a => ({
          name: this.client.selfbot && a.type == 4 ? 'Custom Status' : a.name,
          state: this.client.selfbot && a.type == 4 ? a.name : undefined,
          type: typeof a.type === 'number' ? a.type : ActivityTypes[a.type],
          emoji: this.client.selfbot && activity.emoji ? (typeof activity.emoji == "Emoji" ? { id: activity.emoji.id, name: activity.emoji.name } : { id: null, name: activity.emoji }) : null,
          url: a.url ?? undefined,
        })),
      );
    }

    return data;
  }
}

module.exports = ClientPresence;

/* eslint-disable max-len */
/**
 * @external APIPresence
 * @see {@link https://discord.com/developers/docs/rich-presence/how-to#updating-presence-update-presence-payload-fields}
 */
