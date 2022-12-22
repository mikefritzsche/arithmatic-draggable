import {defineStore} from 'pinia'
// import store from '../../store'

import type { ArithmeticFormulaElement } from '@/components/formula-builder-complex/types'

export enum CrudType {
  Create = 'create',
  Update = 'update',
}

type State = {
  crudType: CrudType,
  formula: ArithmeticFormulaElement[]
  saveInProgress: boolean
}


const useCalculatedFieldsStore = defineStore('calculated-fields', {
  state: (): State => ({
    crudType: CrudType.Create,
    formula: [],
    saveInProgress: false,
  }),
  getters: {},
  actions: {

    setSaveInProgress(saveInProgress: boolean): void {
      this.saveInProgress = saveInProgress
    },
    setCrudType(crudType: CrudType): void {
      this.crudType = crudType
    },
    setFormula(formula: ArithmeticFormulaElement[]): void {
      this.formula = formula
    },
  },
})

export { useCalculatedFieldsStore }