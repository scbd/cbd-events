# Nuxt 4 + Vue 3 Migration Plan

**Plan Name:** nuxt4-migration  
**Created:** 2026-02-23  
**Status:** APPROVED  
**Branch prefix:** `p{phase}-{task}-description`

## Summary

Migrate CBD Events hybrid mobile app from Nuxt 2.18 + Vue 2.7 to Nuxt 4 + Vue 3, upgrading all dependencies to their latest versions.

## Scope

| Area | From | To |
|------|------|----|
| Framework | Nuxt 2.18 | Nuxt 4.x |
| UI Framework | Vue 2.7 | Vue 3.x |
| State Management | Vuex 3 | Pinia 3 |
| CSS Framework | Bootstrap 4.6 | Bootstrap 5.3 |
| HTTP (web) | `@nuxtjs/axios` | `ofetch` / `$fetch` |
| HTTP (native) | `@ionic-native/http` | Capacitor native fetch |
| i18n | `nuxt-i18n` v6 | `@nuxtjs/i18n` v9+ |
| Build tool | Webpack 4 | Vite 6 |
| Component API | Options API | Composition API + `<script setup>` |
| Routing params | `_param` directories | `[param]` directories |
| Capacitor (root) | v6 plugins | v7 plugins (match capacitor/) |

## Constraints

- **SPA mode only** — `ssr: false` (no SSR)
- **No branch pushes or commits during implementation** — all work local
- **Must preserve**: Capacitor iOS/Android builds, OTA updates, offline-first storage, dual-platform HTTP
- **Task sizing**: ~200 LOC per task (max 400), excluding tests/comments/config

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Pinia | Official Vue 3 replacement for Vuex; devtools, persistence |
| Native HTTP | Capacitor native fetch | Cap 6+ patches fetch on native; simplest approach |
| Bootstrap | Upgrade to 5 | Drop jQuery dependency, modern utilities |
| Event bus replacement | mitt | Lightweight, TypeScript-friendly, drop-in for `$root.$on/off/emit` |
| Testing | Unit tests per task | No existing tests; build coverage incrementally |

## Phases Overview

| # | Phase | Tasks | Risk |
|---|-------|-------|------|
| 1 | Project Scaffolding & Config | 3 | 🔴 HIGH |
| 2 | Core Plugins & Infrastructure | 5 | 🔴 HIGH |
| 3 | State Management (Vuex → Pinia) | 4 | 🔴 HIGH |
| 4 | HTTP & Data Layer | 2 | 🟡 MEDIUM |
| 5 | Mixins → Composables | 2 | 🟡 MEDIUM |
| 6 | Layouts, Middleware & Pages | 5 | 🔴 HIGH |
| 7 | Calendar Widget | 2 | 🔴 HIGH |
| 8 | Bootstrap 5, i18n, Cleanup & Verification | 4 | 🟡 MEDIUM |
| **Total** | | **27 tasks** | |

## Research

See [temp/research/codebase-analysis.md](temp/research/codebase-analysis.md) for the full 981-line codebase analysis.