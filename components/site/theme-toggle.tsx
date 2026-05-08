'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
}
