'use strict'

const legacyCID = require('cids')
// @ts-ignore
const CID = require('multiformats/cid')

/**
 * Makes sure that an object only contains js-cid style CIDs.
 *
 * It traverses the object recursively and changes all instances of a CID from
 * a js-multiforamts style CID to a js-cid style CID (js-cid style CIDs stay
 * as they are). You can also pass in a CID directly.
 *
 * Once js-cid is no longer used in the code base, this utility function will
 * no longer be needed.
 *
 * @param {any} obj - The object to do the transformation on
 */
const asLegacyCid = (obj) => {
  if (legacyCID.isCID(obj)) {
    return obj
  }

  // NOTE vmx 2021-02-22: I have no idea why TypeScript doesn't pick this up
  // correctly => ignore it for now, deal with it later.
  // @ts-ignore
  const newCID = CID.asCID(obj)
  if (newCID) {
    const { version, code, multihash: { bytes } } = newCID
    const { buffer, byteOffset, byteLength } = bytes
    const multihash = Buffer.from(buffer, byteOffset, byteLength)
    return new legacyCID(version, code, multihash)
    }

  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      obj[key] = asLegacyCid(value)
    }
  }

  return obj
}

module.exports = asLegacyCid
