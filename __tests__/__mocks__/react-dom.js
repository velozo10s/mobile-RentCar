// __mocks__/react-dom.js
module.exports = {
  unstable_batchedUpdates: cb => cb(),
  createPortal: node => node,
};
