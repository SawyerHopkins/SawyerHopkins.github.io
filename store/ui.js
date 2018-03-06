export const state = () => ({
  version: process.env.VERSION.replace(/"/g, ''),
})