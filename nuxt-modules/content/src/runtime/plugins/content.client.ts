export default {
  async setup() {
    // Auto-import queryContent function
    const queryContent = async (path: string) => {
      const { queryContent } = await import('../app/composables/useContent')
      return queryContent(path)
    }

    // Make it globally available
    if (process.client) {
      ;(globalThis as any).queryContent = queryContent
    }
  }
}
