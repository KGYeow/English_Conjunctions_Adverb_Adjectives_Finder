
export default defineNuxtRouteMiddleware(async(to, from) => {
  // Redirect to the root page if not authorized to access the other pages
  if (to.fullPath != '/') {
    return navigateTo('/')
  }
})