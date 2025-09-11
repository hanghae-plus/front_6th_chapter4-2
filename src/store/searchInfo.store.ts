type SearchInfo = { tableId: string; day?: string; time?: number } | null;
export class SearchInfoStore {
  private searchInfo: SearchInfo = null;
  private searchListeners = new Set<() => void>();

  setSearchInfo(info: SearchInfo) {
    this.searchInfo = info;
    this.searchListeners.forEach(callback => callback());
  }

  getSearchInfo() {
    return this.searchInfo;
  }

  subscribeSearch(callback: () => void) {
    this.searchListeners.add(callback);
    return () => this.searchListeners.delete(callback);
  }
}

export const searchInfoStore = new SearchInfoStore();
