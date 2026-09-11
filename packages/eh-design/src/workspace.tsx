import type {ReactNode} from "react";
import {EHLogo, EHButton} from "./primitives";
import s from "./styles.module.css";
export function EHWorkspaceFrame({navigation,account,mobileMenu,notifications,context,children,homeHref,bottomNav}: {navigation:ReactNode;account:ReactNode;mobileMenu:ReactNode;notifications:ReactNode;context:string;children:ReactNode;homeHref:string;bottomNav:ReactNode}) {
 return <div className={s.workspace}><aside className={s.workspaceSidebar}><EHLogo href={homeHref}/><nav aria-label="Hauptnavigation" className={s.workspaceNav}>{navigation}</nav><div className={s.workspaceAccount}>{account}</div></aside><main className={s.workspaceMain}><header className={s.workspaceTop}><div className={s.workspaceMobile}>{mobileMenu}<EHLogo href={homeHref}/></div><span className={s.workspaceContext}>{context}</span><div className={s.workspaceTools}>{notifications}</div></header><div className={s.workspaceContent}>{children}</div></main><div className={s.workspaceBottom}>{bottomNav}</div></div>;
}
export function EHWorkspaceNavItem({href,active,icon,children}:{href:string;active:boolean;icon:ReactNode;children:ReactNode}) {return <a href={href} aria-current={active?"page":undefined}>{icon}<span>{children}</span></a>;}
export function EHWorkspaceGrid({main,aside}:{main:ReactNode;aside:ReactNode}) {return <div className={s.workspaceGrid}><div className={s.workspaceColumn}>{main}</div><aside className={s.workspaceColumn}>{aside}</aside></div>;}
export function EHWorkSection({title,children,link}:{title:string;children:ReactNode;link?:{href:string;label:string}}) {return <section className={s.workSection}><header><h2>{title}</h2>{link&&<a href={link.href}>{link.label} →</a>}</header>{children}</section>;}
export function EHPriorityAction({eyebrow,title,text,href,label}:{eyebrow:string;title:string;text:string;href:string;label:string}) {return <section className={s.priorityAction}><div><p>{eyebrow}</p><h2>{title}</h2><p>{text}</p></div><EHButton href={href} variant="on-dark" arrow>{label}</EHButton></section>;}
export function EHWorkMetrics({items}:{items:{label:string;value:number|string;href:string;hint?:string}[]}) {return <nav className={s.workMetrics} aria-label="Arbeitsübersicht">{items.map(item=><a key={item.href} href={item.href}><strong>{item.value}</strong><span>{item.label}</span>{item.hint&&<small>{item.hint}</small>}</a>)}</nav>;}
export function EHServiceDirectory({groups}:{groups:{title:string;items:{href:string;title:string;text:string;icon:ReactNode}[]}[]}) {return <div className={s.serviceDirectory}>{groups.map(group=><section key={group.title}><h2>{group.title}</h2><div>{group.items.map(item=><a key={item.href} href={item.href}><span className={s.directoryIcon}>{item.icon}</span><span><strong>{item.title}</strong><span>{item.text}</span></span><span aria-hidden="true">↗</span></a>)}</div></section>)}</div>;}
export function EHRequestList({items}:{items:{id:string;kind:string;title:string;description:string;location:string;price?:string|null;time:string;href:string}[]}) {return <div className={s.requestList}>{items.map(item=><a key={item.id} href={item.href}><div><span className={s.requestKind}>{item.kind}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.location} · {item.time}</small></div><div className={s.requestAction}>{item.price&&<strong>{item.price}</strong>}<span>Vorgang öffnen ↗</span></div></a>)}</div>;}


export type EHOwnerDashboardStatusItem = {
  id: string;
  label: string;
  title: string;
  meta: string;
  href?: string;
  icon: ReactNode;
};

export type EHOwnerDashboardOverviewItem = {
  id: string;
  label: string;
  title: string;
  meta: string;
  href: string;
  icon: ReactNode;
};

export type EHOwnerDashboardUtilityGroup = {
  title: string;
  items: {
    href: string;
    title: string;
    text: string;
    icon: ReactNode;
  }[];
  footerLink?: {
    href: string;
    label: string;
  };
};

export function EHOwnerDashboardHeader({
  eyebrow,
  title,
  text,
  imageSrc,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <header className={s.ownerDashboardHeader}>
      <div className={s.ownerDashboardHeaderCopy}>
        <p className={s.ownerDashboardEyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>

      <figure className={s.ownerDashboardHeaderMedia}>
        <img src={imageSrc} alt={imageAlt} />
      </figure>
    </header>
  );
}

export function EHOwnerDashboardTopGrid({
  main,
  aside,
}: {
  main: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className={s.ownerDashboardTopGrid}>
      <div>{main}</div>
      <aside>{aside}</aside>
    </div>
  );
}

export function EHOwnerDashboardStatus({
  eyebrow,
  title,
  text,
  items,
  primaryAction,
}: {
  eyebrow: string;
  title: string;
  text: string;
  items: EHOwnerDashboardStatusItem[];
  primaryAction?: {
    href: string;
    label: string;
  };
}) {
  return (
    <section className={s.ownerDashboardStatus}>
      <header className={s.ownerDashboardStatusHeader}>
        <div>
          <p className={s.ownerDashboardEyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>

        {primaryAction && (
          <EHButton href={primaryAction.href} arrow>
            {primaryAction.label}
          </EHButton>
        )}
      </header>

      <div className={s.ownerDashboardStatusItems}>
        {items.map((item) => {
          const content = (
            <>
              <span className={s.ownerDashboardItemIcon}>{item.icon}</span>

              <span className={s.ownerDashboardItemCopy}>
                <span className={s.ownerDashboardItemLabel}>
                  {item.label}
                </span>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
            </>
          );

          return item.href ? (
            <a
              className={s.ownerDashboardStatusItem}
              href={item.href}
              key={item.id}
            >
              {content}
            </a>
          ) : (
            <div
              className={s.ownerDashboardStatusItem}
              key={item.id}
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function EHOwnerDashboardOverview({
  title,
  items,
  emptyText,
  footerLink,
}: {
  title: string;
  items: EHOwnerDashboardOverviewItem[];
  emptyText: string;
  footerLink: {
    href: string;
    label: string;
  };
}) {
  return (
    <section className={s.ownerDashboardOverview}>
      <header>
        <h2>{title}</h2>
        <span aria-hidden="true">›</span>
      </header>

      {items.length > 0 ? (
        <div className={s.ownerDashboardOverviewItems}>
          {items.map((item) => (
            <a href={item.href} key={item.id}>
              <span className={s.ownerDashboardItemIcon}>
                {item.icon}
              </span>

              <span className={s.ownerDashboardItemCopy}>
                <span className={s.ownerDashboardItemLabel}>
                  {item.label}
                </span>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>

              <span
                className={s.ownerDashboardRowArrow}
                aria-hidden="true"
              >
                ›
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className={s.ownerDashboardOverviewEmpty} role="status">
          {emptyText}
        </p>
      )}

      <a
        className={s.ownerDashboardOverviewFooter}
        href={footerLink.href}
      >
        {footerLink.label}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

export function EHOwnerDashboardComposer({
  title,
  text,
  composer,
  examples,
}: {
  title: string;
  text: string;
  composer: ReactNode;
  examples: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <section className={s.ownerDashboardComposer}>
      <header>
        <h2>{title}</h2>
        <p>{text}</p>
      </header>

      <div className={s.ownerDashboardComposerGrid}>
        <div className={s.ownerDashboardComposerInput}>
          {composer}
        </div>

        <aside className={s.ownerDashboardExamples}>
          <h3>Beispiele für Anliegen</h3>

          <nav aria-label="Beispiele für Anliegen">
            {examples.map((example) => (
              <a
                href={example.href}
                key={example.label}
              >
                <span>{example.label}</span>
                <span aria-hidden="true">›</span>
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}

export function EHOwnerDashboardUtilityGrid({
  groups,
}: {
  groups: EHOwnerDashboardUtilityGroup[];
}) {
  return (
    <div className={s.ownerDashboardUtilityGrid}>
      {groups.map((group) => (
        <section
          className={s.ownerDashboardUtilityCard}
          key={group.title}
        >
          <h2>{group.title}</h2>

          <div className={s.ownerDashboardUtilityItems}>
            {group.items.map((item) => (
              <a href={item.href} key={item.href}>
                <span className={s.ownerDashboardItemIcon}>
                  {item.icon}
                </span>

                <span className={s.ownerDashboardItemCopy}>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>

                <span
                  className={s.ownerDashboardRowArrow}
                  aria-hidden="true"
                >
                  ›
                </span>
              </a>
            ))}
          </div>

          {group.footerLink && (
            <a
              className={s.ownerDashboardUtilityFooter}
              href={group.footerLink.href}
            >
              {group.footerLink.label}
              <span aria-hidden="true">→</span>
            </a>
          )}
        </section>
      ))}
    </div>
  );
}
