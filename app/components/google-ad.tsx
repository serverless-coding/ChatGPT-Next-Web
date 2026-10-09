"use client";

import { memo, useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-3614504270218797";
const AD_SLOT = "3578902834";

function GoogleAdComponent(props: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    // 只在容器存在且尚未初始化时创建广告，避免重复 push。
    if (!container || pushed.current) return;
    pushed.current = true;

    // 通过 DOM API 命令式创建 <ins>，让 React 不持有该节点，
    // 避免 adsbygoogle 注入 iframe 后与 React 协调冲突（会导致父组件重渲染报错）。
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", AD_CLIENT);
    ins.setAttribute("data-ad-slot", AD_SLOT);
    ins.setAttribute("data-ad-format", "auto");
    // 侧边栏内的广告不能按整屏宽度渲染，否则会撑大侧边栏、把聊天窗口挤出容器。
    ins.setAttribute("data-full-width-responsive", "false");
    container.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("[GoogleAd] failed to push adsbygoogle", err);
    }
  }, []);

  // React 只渲染一个稳定的空容器，内部 <ins> 完全交由上面的副作用管理。
  return <div ref={containerRef} className={props.className} />;
}

export const GoogleAd = memo(GoogleAdComponent);
