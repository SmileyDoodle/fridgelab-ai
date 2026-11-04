import { useCallback, useMemo, useState } from 'react'
import { INITIAL_PANTRY_INGREDIENTS } from '../constants/pantryData.ts'
import { DEFAULT_ENERGY_MODE } from '../constants/recipeConfig.ts'
import type { EnergyMode } from '../types/recipe.ts'

export interface PantryState {
  selectedIngredientIds: string[]
  customIngredients: string[]
  energyMode: EnergyMode | null
}

export const INITIAL_PANTRY_STATE: PantryState = {
  selectedIngredientIds: [],
  customIngredients: [],
  energyMode: DEFAULT_ENERGY_MODE,
}

/**
 * Custom hook managing pantry selection state and operations.
 * Encapsulates staple ingredient toggles, custom items, and energy mode selection.
 */
export function usePantry(initialState: PantryState = INITIAL_PANTRY_STATE) {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(
    initialState.selectedIngredientIds
  )
  const [customIngredients, setCustomIngredients] = useState<string[]>(
    initialState.customIngredients
  )
  const [energyMode, setEnergyMode] = useState<EnergyMode | null>(
    initialState.energyMode
  )

  // Toggle staple ingredient by ID
  const handleToggleIngredient = useCallback((id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  // Clear all staple ingredients
  const handleClearSelectedIngredients = useCallback(() => {
    setSelectedIngredientIds([])
  }, [])

  // Append custom ingredient string
  const handleAddCustomIngredient = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCustomIngredients((prev) =>
      prev.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : [...prev, trimmed]
    )
  }, [])

  // Remove custom ingredient string
  const handleRemoveCustomIngredient = useCallback((name: string) => {
    setCustomIngredients((prev) => prev.filter((item) => item !== name))
  }, [])

  // Clear all custom ingredients
  const handleClearCustomIngredients = useCallback(() => {
    setCustomIngredients([])
  }, [])

  // Batch-apply quick inspiration pantry preset
  const applyPantryInspiration = useCallback(
    (stapleIds: string[], custom: string[], mode: EnergyMode) => {
      setSelectedIngredientIds(stapleIds)
      setCustomIngredients(custom)
      setEnergyMode(mode)
    },
    []
  )

  // Derived staple ingredient names from current selected IDs
  const stapleNames = useMemo(
    () =>
      INITIAL_PANTRY_INGREDIENTS.filter((item) =>
        selectedIngredientIds.includes(item.id)
      ).map((item) => item.name),
    [selectedIngredientIds]
  )

  // Combined ingredients list (staples + custom freeform entries)
  const allIngredients = useMemo(
    () => [...stapleNames, ...customIngredients],
    [stapleNames, customIngredients]
  )

  const totalIngredientsCount = selectedIngredientIds.length + customIngredients.length

  return {
    // State
    selectedIngredientIds,
    customIngredients,
    energyMode,
    // Derived values
    stapleNames,
    allIngredients,
    totalIngredientsCount,
    // Methods / Actions
    handleToggleIngredient,
    handleClearSelectedIngredients,
    handleAddCustomIngredient,
    handleRemoveCustomIngredient,
    handleClearCustomIngredients,
    setEnergyMode,
    applyPantryInspiration,
  }
}
