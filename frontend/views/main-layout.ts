import '@vaadin/app-layout';
import { AppLayout } from '@vaadin/app-layout';
import '@vaadin/app-layout/vaadin-drawer-toggle';
import '@vaadin/avatar';
import '@vaadin/icon';
import '@vaadin/menu-bar';
import type { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import '@vaadin/scroller';
import '@vaadin/side-nav';
import '@vaadin/tabs';
import '@vaadin/tabs/vaadin-tab';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset';
import type User from 'Frontend/generated/com/example/application/data/entity/User.js';
import { imageDataUrl } from 'Frontend/util.js';
import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { logout } from '../auth.js';
import { router } from '../index.js';
import { appStore } from '../stores/app-store.js';
import { Layout } from './view.js';

interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

@customElement('main-layout')
export class MainLayout extends Layout {
  render() {
    return html`
      <vaadin-app-layout primary-section="drawer">
        <header slot="drawer">
          <h1 class="text-l m-0">${appStore.applicationName}</h1>
        </header>
        <vaadin-scroller slot="drawer" scroll-direction="vertical">
          <vaadin-side-nav aria-label="${appStore.applicationName}">
            ${this.getMenuRoutes().map(
              (viewRoute) => html`
                <vaadin-side-nav-item path=${router.urlForPath(viewRoute.path)}>
                  <span
                    class="navicon"
                    style="--mask-image: url('line-awesome/svg/${viewRoute.icon}.svg')"
                    slot="prefix"
                    aria-hidden="true"
                  ></span>
                  ${viewRoute.title}
                </vaadin-side-nav-item>
              `
            )}
          </vaadin-side-nav>
        </vaadin-scroller>

        <footer slot="drawer">
          ${appStore.user
            ? html`
                <vaadin-menu-bar
                  theme="tertiary-inline contrast"
                  .items="${this.getUserMenuItems(appStore.user)}"
                  @item-selected="${this.userMenuItemSelected}"
                ></vaadin-menu-bar>
              `
            : html`<a router-ignore href="login">Sign in</a>`}
        </footer>

        <vaadin-drawer-toggle slot="navbar" aria-label="Menu toggle"></vaadin-drawer-toggle>
        <h2 slot="navbar" class="text-l m-0">${appStore.currentViewTitle}</h2>

        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
    this.reaction(
      () => appStore.location,
      () => {
        AppLayout.dispatchCloseOverlayDrawerEvent();
      }
    );
  }

  private getUserMenuItems(user: User): MenuBarItem[] {
    return [
      {
        component: this.createUserMenuItem(user),
        children: [{ text: 'Sign out' }],
      },
    ];
  }

  private createUserMenuItem(user: User) {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = 'var(--lumo-space-s)';
    render(
      html`
        <vaadin-avatar
          theme="xsmall"
          img="${until(imageDataUrl(user.profilePicture))}"
          name="${user.name}"
          tabindex="-1"
        ></vaadin-avatar>
        <span>${user.name}</span>
        <vaadin-icon icon="lumo:dropdown"></vaadin-icon>
      `,
      item
    );
    return item;
  }

  private userMenuItemSelected(e: MenuBarItemSelectedEvent) {
    if (e.detail.value.text === 'Sign out') {
      logout();
    }
  }

  private getMenuRoutes(): RouteInfo[] {
    return [
      {
        path: 'master-detail',
        title: 'Master-Detail',
        icon: 'columns-solid',
      },

      {
        path: 'hello',
        title: 'Hello World',
        icon: 'globe-solid',
      },

      {
        path: 'about',
        title: 'About',
        icon: 'file',
      },

      {
        path: 'empty',
        title: 'Empty',
        icon: 'file',
      },

      {
        path: 'chat',
        title: 'Chat',
        icon: 'comments',
      },

      {
        path: 'hello-world-designer',
        title: 'Hello World Designer',
        icon: 'globe-solid',
      },

      {
        path: 'master-detail-designer',
        title: 'Master Detail Designer',
        icon: 'columns-solid',
      },

      {
        path: 'collaborative-master-detail',
        title: 'Collaborative Master-Detail',
        icon: 'columns-solid',
      },

      {
        path: 'hello-world-hilla',
        title: 'Hello World Hilla',
        icon: 'globe-solid',
      },
    ];
  }
}
