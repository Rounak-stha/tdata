import { render, screen, fireEvent, within } from "@testing-library/react";
import { StatusSelect } from "@components/selects/status";
import { WorkflowStatus } from "@/types/workflow";

const mockStatuses: WorkflowStatus[] = [
  { id: 1, name: "To Do", icon: "Goal", createdAt: new Date(), updatedAt: new Date(), organizationId: 1, workflowId: 1, createdBy: "asdf" },
  { id: 2, name: "In Progress", icon: "Hold", createdAt: new Date(), updatedAt: new Date(), organizationId: 1, workflowId: 1, createdBy: "asdf" },
];

describe("StatusSelect", () => {
  test("renders with initial status", () => {
    render(<StatusSelect status={mockStatuses[0]} allStatus={mockStatuses} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  test("opens dropdown and selects a new status", () => {
    const mockOnChange = vi.fn();
    render(<StatusSelect status={mockStatuses[0]} allStatus={mockStatuses} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole("combobox")); // Open dropdown
    const dropdown = screen.getByRole("presentation"); // Get dropdown content
    const option = within(dropdown).getByText("In Progress"); // Search inside dropdown
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith({
      newValue: mockStatuses[1],
      previousValue: mockStatuses[0],
    });
  });

  test("disables select when isLoading is true", () => {
    render(<StatusSelect allStatus={mockStatuses} isLoading />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  test("renders loading state", () => {
    render(<StatusSelect allStatus={mockStatuses} isLoading />);
    expect(screen.getByRole("combobox")).toContainHTML("animate-spin");
  });

  test("disables selection when displayOnly is true", () => {
    render(<StatusSelect allStatus={mockStatuses} displayOnly />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
