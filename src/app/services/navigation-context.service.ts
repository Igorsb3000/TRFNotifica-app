import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationContextService {
  private static readonly SOURCE_COMPONENT_KEY = 'sourceComponent';

  setSourceComponent(source: string) {
    sessionStorage.setItem(NavigationContextService.SOURCE_COMPONENT_KEY, source);
  }

  getSourceComponent(): string | null {
    return sessionStorage.getItem(NavigationContextService.SOURCE_COMPONENT_KEY);
  }

  clearSourceComponent() {
    sessionStorage.removeItem(NavigationContextService.SOURCE_COMPONENT_KEY);
  }
}
