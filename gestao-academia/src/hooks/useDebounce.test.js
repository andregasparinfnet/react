// src/hooks/useDebounce.test.js

import { test, expect, describe, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

// (Feature: Teste) - Teste unitário para o hook useDebounce
describe('useDebounce Hook', () => {
  
  // Informa ao Vitest que vamos controlar o tempo manualmente
  vi.useFakeTimers();

  // Limpa os timers após cada teste
  afterEach(() => {
    vi.clearAllTimers();
  });

  test('deve retornar o valor inicial imediatamente', () => {
    // 1. Renderiza o hook
    const { result } = renderHook(() => useDebounce('valor inicial', 500));
    
    // 2. Verifica se o valor retornado (result.current) é o valor inicial
    expect(result.current).toBe('valor inicial');
  });

  test('não deve atualizar o valor antes do delay', () => {
    // 1. Renderiza o hook
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay), 
      { initialProps: { value: 'primeiro', delay: 500 } }
    );

    // 2. Simula o utilizador a digitar um novo valor
    rerender({ value: 'segundo', delay: 500 });
    
    // 3. Avança o relógio em 499ms (quase 500ms)
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // 4. VERIFICA: O valor AINDA deve ser o antigo
    expect(result.current).toBe('primeiro');
  });

  test('deve atualizar o valor apenas após o delay', () => {
    // 1. Renderiza o hook
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay), 
      { initialProps: { value: 'primeiro', delay: 500 } }
    );

    // 2. Simula o utilizador a digitar um novo valor
    rerender({ value: 'segundo', delay: 500 });

    // 3. Avança o relógio em 500ms (exatamente o delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 4. VERIFICA: O valor AGORA deve ser o novo
    expect(result.current).toBe('segundo');
  });

  test('deve cancelar o timer anterior se o valor mudar novamente', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay), 
      { initialProps: { value: 'A', delay: 500 } }
    );

    // 1. Digita "B"
    rerender({ value: 'B', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300); // Passam 300ms
    });
    expect(result.current).toBe('A'); // Ainda "A"

    // 2. Digita "C" (antes dos 500ms do "B" terminarem)
    rerender({ value: 'C', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300); // Passam 300ms (Total 600ms desde "B")
    });
    
    // 3. VERIFICA: O valor AINDA deve ser "A", pois o timer de "B" foi cancelado
    expect(result.current).toBe('A');
    
    // 4. Avança o tempo para completar o timer de "C"
    act(() => {
      vi.advanceTimersByTime(200); // Total 500ms desde "C"
    });
    
    // 5. VERIFICA: Agora deve ser "C"
    expect(result.current).toBe('C');
  });
});
