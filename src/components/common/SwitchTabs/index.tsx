"use client";
import React, { useState, useRef, useEffect } from "react";

interface SwitchTabsProps {
  data: string[];
  onTabChange: (tab: string, index: number) => void;
}

export default function SwitchTabs({ data, onTabChange }: SwitchTabsProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const currentItem = itemRefs.current[selectedTab];
    if (currentItem) {
      setLeft(currentItem.offsetLeft);
      setWidth(currentItem.offsetWidth);
    }
  }, [selectedTab, data]);

  const activeTab = (tab: string, index: number) => {
    const currentItem = itemRefs.current[index];
    if (currentItem) {
      setLeft(currentItem.offsetLeft);
      setWidth(currentItem.offsetWidth);
    }
    setSelectedTab(index);
    onTabChange(tab, index);
  };

  return (
    <div className="switchingTabs">
      <div className="tabItems">
        {data.map((tab, index) => (
          <span
            key={tab}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`tabItem ${selectedTab === index ? "active" : ""}`}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <span
          className="movingBg"
          style={{ left: `${left}px`, width: `${width}px` }}
        />
      </div>
    </div>
  );
}
