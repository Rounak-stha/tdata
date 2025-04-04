import { FlowVariable, FlowVariableType, FlowVariableValue } from "@tdata/shared/types";

export class FlowVariableManager {
  private variables: Map<string, FlowVariable>;

  constructor(initialVariables?: FlowVariable[]) {
    this.variables = new Map();

    if (initialVariables) {
      initialVariables.forEach((variable) => {
        this.addVariable(variable);
      });
    }
  }

  // Add a new variable to the map
  addVariable(variable: FlowVariable): void {
    this.variables.set(variable.id, variable);
  }

  // Remove a variable by its ID
  removeVariable(variableId: string): boolean {
    return this.variables.delete(variableId);
  }

  // Get a variable by its ID
  getVariable(variableId: string): FlowVariable | undefined {
    return this.variables.get(variableId);
  }

  // Check if a variable has a value set
  hasValue(variableId: string): boolean {
    const variable = this.getVariable(variableId);
    return variable !== undefined && variable.value !== undefined && variable.value !== "";
  }

  // Get the value of a variable
  getValue(variableId: string): FlowVariableValue | undefined {
    const variable = this.getVariable(variableId);
    return variable ? variable.value : undefined;
  }

  // Set the value of a variable
  setValue(variableId: string, value: string): void {
    const variable = this.getVariable(variableId);

    if (!variable) {
      throw new Error(`Variable with ID ${variableId} not found`);
    }

    variable.value = value;
    this.variables.set(variableId, variable);
  }

  // Get all variables
  getAllVariables(): FlowVariable[] {
    return Array.from(this.variables.values());
  }

  // Get variables by type
  getVariablesByType(type: FlowVariableType): FlowVariable[] {
    return Array.from(this.variables.values()).filter((variable) => variable.type === type);
  }
}
