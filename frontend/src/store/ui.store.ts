import React from "react";
import { create } from "zustand";

{
  /*Active Tabs*/
}

interface ActiveTab {
  activeTab: string;
  setActiveTab: (name: string) => void;
}

interface ActiveSidebarItem {
  activeItem: string;
  setActiveItem: (name: string) => void;
}

{
  /*Drag States*/
}

interface dragState {
  isDragging: boolean;
  setDragging: (name: boolean) => void;
}

interface fileUploadState {
  isFileUploaded: File | null;
  setFileUploaded: (uploadedFile: File | null) => void;
}

{
  /*Active Collapsible Items*/
}

interface CollapsibleItem {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

interface SelectedModelState {
  selectedModel: string | null;
  setSelectedModel: (selectedModel: string | null) => void;
}

{
  /*Active ui for Header Tab */
}

export const useActiveTabStore = create<ActiveTab>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (name) => set((state) => ({ activeTab: name })),
}));

{
  /*Active ui for Sidebar */
}

export const useActiveSidebarStore = create<ActiveSidebarItem>((set) => ({
  activeItem: "new-scan",
  setActiveItem: (name) => set((state) => ({ activeItem: name })),
}));

{
  /*Drag State */
}

export const useDragStateStore = create<dragState>((set) => ({
  isDragging: false,
  setDragging: (isDragging) => set((state) => ({ isDragging })),
}));

{
  /*File Upload State */
}

export const useFileUploadStateStore = create<fileUploadState>((set) => ({
  isFileUploaded: null,
  setFileUploaded: (uploadedFile) =>
    set((state) => ({ isFileUploaded: uploadedFile })),
}));

{
  /*Collapsible Item State */
}

export const useCollapsibleItemStore = create<CollapsibleItem>((set) => ({
  isCollapsed: false,
  setCollapsed: (isCollapsed) => set((state) => ({ isCollapsed })),
}));

{
  /*Selected Model State */
}

export const useSelectedModelStore = create<SelectedModelState>((set) => ({
  selectedModel: null,
  setSelectedModel: (selectedModel) => set((state) => ({ selectedModel })),
}));
