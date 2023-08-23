// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canGuest: currentUser && currentUser.access === 'guest',
    canUser: currentUser && currentUser.access === 'user',
  };
}
