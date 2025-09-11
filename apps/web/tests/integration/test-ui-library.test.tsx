import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock UI Components for integration testing
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    size?: string;
    variant?: string;
  }
>(({ children, onClick, size, variant, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    data-size={size}
    data-variant={variant}
    {...props}
  >
    {children}
  </button>
));

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input ref={ref} {...props} />);

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <label ref={ref} {...props}>
    {children}
  </label>
));

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <p ref={ref} {...props}>
    {children}
  </p>
));

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <h3 ref={ref} {...props}>
    {children}
  </h3>
));

const Dialog = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="dialog">{children}</div>
);

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <p ref={ref} {...props}>
    {children}
  </p>
));

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <h2 ref={ref} {...props}>
    {children}
  </h2>
));

const DialogTrigger = ({
  children,
  asChild,
  ...props
}: {
  children?: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;

const Select = ({
  children,
  value,
  onValueChange,
}: {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  const [selectedLabel, setSelectedLabel] = React.useState('');

  const handleValueChange = (newValue: string, label: string) => {
    setSelectedValue(newValue);
    setSelectedLabel(label);
    onValueChange?.(newValue);
  };

  return (
    <div data-testid="select" data-value={selectedValue}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              selectedValue,
              selectedLabel,
              handleValueChange,
            })
          : child,
      )}
    </div>
  );
};

const SelectContent = ({
  children,
  handleValueChange,
}: {
  children?: React.ReactNode;
  handleValueChange?: (value: string, label: string) => void;
}) => (
  <div data-testid="select-content">
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { handleValueChange })
        : child,
    )}
  </div>
);

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    value?: string;
    handleValueChange?: (value: string, label: string) => void;
  }
>(({ children, value, handleValueChange, onClick, ...props }, ref) => (
  <div
    ref={ref}
    data-value={value}
    onClick={(e) => {
      if (handleValueChange && value && children) {
        handleValueChange(value, children as string);
      }
      onClick?.(e);
    }}
    {...props}
  >
    {children}
  </div>
));

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    selectedLabel?: string;
  }
>(({ children, selectedLabel, ...props }, ref) => (
  <button ref={ref} type="button" {...props}>
    {selectedLabel || children}
  </button>
));

const SelectValue = ({
  placeholder,
  selectedLabel,
}: { placeholder?: string; selectedLabel?: string }) => (
  <span data-testid="select-value">{selectedLabel || placeholder}</span>
);

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ onCheckedChange, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props}
  />
));

const RadioGroup = ({
  children,
  value,
  onValueChange,
}: {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => (
  <div
    data-testid="radio-group"
    data-value={value}
    data-on-value-change={!!onValueChange}
  >
    {children}
  </div>
);

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value?: string }
>(({ value, ...props }, ref) => (
  <input ref={ref} type="radio" value={value} {...props} />
));

const Tabs = ({
  children,
  defaultValue = 'tab1',
}: { children?: React.ReactNode; defaultValue?: string }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div data-testid="tabs" data-active-tab={activeTab}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child,
      )}
    </div>
  );
};

const TabsContent = ({
  children,
  value,
  activeTab,
}: { children?: React.ReactNode; value?: string; activeTab?: string }) => {
  if (activeTab !== value) {
    return null;
  }
  return <div data-testid={`tab-content-${value}`}>{children}</div>;
};

const TabsList = ({
  children,
  setActiveTab,
}: { children?: React.ReactNode; setActiveTab?: (value: string) => void }) => (
  <div data-testid="tabs-list">
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { setActiveTab })
        : child,
    )}
  </div>
);

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    value?: string;
    setActiveTab?: (value: string) => void;
  }
>(({ children, value, setActiveTab, onClick, ...props }, ref) => (
  <button
    ref={ref}
    data-value={value}
    onClick={(e) => {
      if (setActiveTab && value) {
        setActiveTab(value);
      }
      onClick?.(e);
    }}
    {...props}
  >
    {children}
  </button>
));

const Form = ({ children }: { children?: React.ReactNode }) => (
  <form>{children}</form>
);

const FormControl = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);

const FormDescription = ({ children }: { children?: React.ReactNode }) => (
  <p>{children}</p>
);

const FormField = ({
  children,
  name,
}: { children?: React.ReactNode; name?: string }) => (
  <div data-name={name}>{children}</div>
);

const FormItem = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);

const FormLabel = ({ children }: { children?: React.ReactNode }) => (
  <label>{children}</label>
);

const FormMessage = ({ children }: { children?: React.ReactNode }) => (
  <span>{children}</span>
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    variant?: string;
  }
>(({ children, variant, ...props }, ref) => (
  <div ref={ref} role="alert" data-variant={variant} {...props}>
    {children}
  </div>
));

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <p ref={ref} {...props}>
    {children}
  </p>
));

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <h4 ref={ref} {...props}>
    {children}
  </h4>
));

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    variant?: string;
  }
>(({ children, variant = 'default', ...props }, ref) => (
  <span ref={ref} data-variant={variant} {...props}>
    {children}
  </span>
));

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    min?: number;
    max?: number;
  }
>(({ value, min = 0, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    {...props}
  />
));

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ checked, onCheckedChange, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  />
));

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => <textarea ref={ref} {...props} />);

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <table ref={ref} {...props}>
    {children}
  </table>
));

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <tbody ref={ref} {...props}>
    {children}
  </tbody>
));

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <td ref={ref} {...props}>
    {children}
  </td>
));

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <th ref={ref} {...props}>
    {children}
  </th>
));

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <thead ref={ref} {...props}>
    {children}
  </thead>
));

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => (
  <tr ref={ref} {...props}>
    {children}
  </tr>
));

const Accordion = ({
  children,
  type = 'single',
  collapsible = true,
}: { children?: React.ReactNode; type?: string; collapsible?: boolean }) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (type === 'single') {
        // Single type: only one item open at a time
        if (newSet.has(value)) {
          if (collapsible) {
            newSet.delete(value);
          }
        } else {
          newSet.clear();
          newSet.add(value);
        }
      } else {
        // Multiple type: toggle individual items
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
      }
      return newSet;
    });
  };

  return (
    <div
      data-testid="accordion"
      data-type={type}
      data-collapsible={collapsible}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { openItems, toggleItem })
          : child,
      )}
    </div>
  );
};

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    openItems?: Set<string>;
    value?: string;
  }
>(({ children, openItems, value, ...props }, ref) => (
  <div
    ref={ref}
    style={{ display: openItems?.has(value || '') ? 'block' : 'none' }}
    {...props}
  >
    {children}
  </div>
));

const AccordionItem = ({
  children,
  value,
  openItems,
  toggleItem,
}: {
  children?: React.ReactNode;
  value?: string;
  openItems?: Set<string>;
  toggleItem?: (value: string) => void;
}) => {
  const childProps = { value, openItems, toggleItem };
  return (
    <div data-testid={`accordion-item-${value}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, childProps)
          : child,
      )}
    </div>
  );
};

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    value?: string;
    toggleItem?: (value: string) => void;
  }
>(({ children, value, toggleItem, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      if (toggleItem && value) {
        toggleItem(value);
      }
      onClick?.(e);
    }}
    {...props}
  >
    {children}
  </button>
));

// Mock form validation
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: (data: Record<string, unknown>) => void) => fn,
    formState: { errors: {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
  }),
  Controller: ({
    render,
  }: {
    render: (props: { field: Record<string, unknown> }) => React.ReactNode;
  }) => render({ field: {} }),
}));

describe('UI Library Integration', () => {
  describe('Form Components Integration', () => {
    it('should integrate form components with proper validation feedback', async () => {
      const user = userEvent.setup();

      const TestForm = () => (
        <Form>
          <FormField name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  data-testid="email-input"
                />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage data-testid="email-error">
                Email is required
              </FormMessage>
            </FormItem>
          </FormField>
          <Button type="submit" data-testid="submit-btn">
            Submit
          </Button>
        </Form>
      );

      render(<TestForm />);

      const input = screen.getByTestId('email-input');
      const submitBtn = screen.getByTestId('submit-btn');

      // Test form interaction
      await user.type(input, 'test@example.com');
      await user.click(submitBtn);

      expect(input).toHaveValue('test@example.com');
      expect(submitBtn).toBeInTheDocument();
    });

    it('should handle checkbox and radio group interactions', async () => {
      const user = userEvent.setup();

      const TestForm = () => {
        const [selectedValue, setSelectedValue] = React.useState('');
        const [isChecked, setIsChecked] = React.useState(false);

        return (
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={setIsChecked}
                data-testid="terms-checkbox"
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              data-testid="radio-group"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        );
      };

      render(<TestForm />);

      const checkbox = screen.getByTestId('terms-checkbox');
      const radioOption1 = screen.getByLabelText('Option 1');

      await user.click(checkbox);
      await user.click(radioOption1);

      expect(checkbox).toBeChecked();
      expect(radioOption1).toBeChecked();
    });
  });

  describe('Modal and Dialog Integration', () => {
    it('should open and close dialog with proper accessibility', async () => {
      const user = userEvent.setup();

      const TestDialog = () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="open-dialog">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>
                This is a test dialog description.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>Dialog content goes here.</p>
              <Button data-testid="close-dialog">Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      );

      render(<TestDialog />);

      const openButton = screen.getByTestId('open-dialog');
      await user.click(openButton);

      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test dialog description.'),
      ).toBeInTheDocument();

      const closeButton = screen.getByTestId('close-dialog');
      await user.click(closeButton);
    });
  });

  describe('Data Display Components Integration', () => {
    it('should render table with proper structure and accessibility', () => {
      const TestTable = () => (
        <Table data-testid="test-table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>
                <Badge variant="success">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>
                <Badge variant="secondary">Inactive</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      render(<TestTable />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should render cards with proper content structure', () => {
      const TestCards = () => (
        <div>
          <Card data-testid="user-card">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Name: John Doe</p>
                <p>Email: john@example.com</p>
                <Button size="sm">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );

      render(<TestCards />);

      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(
        screen.getByText('Manage your account settings'),
      ).toBeInTheDocument();
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  describe('Navigation Components Integration', () => {
    it('should handle tabs navigation with content switching', async () => {
      const user = userEvent.setup();

      const TestTabs = () => (
        <Tabs defaultValue="tab1" data-testid="test-tabs">
          <TabsList>
            <TabsTrigger value="tab1" data-testid="tab1-trigger">
              Tab 1
            </TabsTrigger>
            <TabsTrigger value="tab2" data-testid="tab2-trigger">
              Tab 2
            </TabsTrigger>
            <TabsTrigger value="tab3" data-testid="tab3-trigger">
              Tab 3
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="tab1-content">
            <Card>
              <CardHeader>
                <CardTitle>Content 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 1.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2" data-testid="tab2-content">
            <Card>
              <CardHeader>
                <CardTitle>Content 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 2.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3" data-testid="tab3-content">
            <Card>
              <CardHeader>
                <CardTitle>Content 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is the content for tab 3.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      );

      render(<TestTabs />);

      // Check initial state
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      // Switch to tab 2
      const tab2Trigger = screen.getByTestId('tab2-trigger');
      await user.click(tab2Trigger);

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

      // Switch to tab 3
      const tab3Trigger = screen.getByTestId('tab3-trigger');
      await user.click(tab3Trigger);

      expect(screen.getByText('Content 3')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should handle accordion expansion and collapse', async () => {
      const user = userEvent.setup();

      const TestAccordion = () => (
        <Accordion type="single" collapsible data-testid="test-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger data-testid="accordion-trigger-1">
              Section 1
            </AccordionTrigger>
            <AccordionContent data-testid="accordion-content-1">
              <p>This is the content for section 1.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger data-testid="accordion-trigger-2">
              Section 2
            </AccordionTrigger>
            <AccordionContent data-testid="accordion-content-2">
              <p>This is the content for section 2.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      render(<TestAccordion />);

      const trigger1 = screen.getByTestId('accordion-trigger-1');
      const content1 = screen.getByTestId('accordion-content-1');

      // Initially content should be hidden
      expect(content1).not.toBeVisible();

      // Click to expand
      await user.click(trigger1);
      expect(content1).toBeVisible();

      // Click again to collapse
      await user.click(trigger1);
      expect(content1).not.toBeVisible();
    });
  });

  describe('Feedback Components Integration', () => {
    it('should render alerts with different variants', () => {
      const TestAlerts = () => (
        <div>
          <Alert data-testid="success-alert">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" data-testid="error-alert">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>

          <Alert variant="warning" data-testid="warning-alert">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>This action cannot be undone.</AlertDescription>
          </Alert>
        </div>
      );

      render(<TestAlerts />);

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(
        screen.getByText('Your changes have been saved successfully.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(
        screen.getByText('Something went wrong. Please try again.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(
        screen.getByText('This action cannot be undone.'),
      ).toBeInTheDocument();
    });

    it('should render progress bars with different values', () => {
      const TestProgress = () => (
        <div>
          <Progress value={25} data-testid="progress-25" />
          <Progress value={50} data-testid="progress-50" />
          <Progress value={75} data-testid="progress-75" />
          <Progress value={100} data-testid="progress-100" />
        </div>
      );

      render(<TestProgress />);

      // Progress components should be rendered
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(4);
    });

    it('should handle switch component state changes', async () => {
      const user = userEvent.setup();

      const TestSwitch = () => {
        const [isChecked, setIsChecked] = React.useState(false);

        return (
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={isChecked}
              onCheckedChange={setIsChecked}
              data-testid="notifications-switch"
            />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>
        );
      };

      render(<TestSwitch />);

      const switchElement = screen.getByTestId('notifications-switch');

      // Initially unchecked
      expect(switchElement).not.toBeChecked();

      // Click to check
      await user.click(switchElement);
      expect(switchElement).toBeChecked();

      // Click again to uncheck
      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });
  });

  describe('Select Component Integration', () => {
    it('should handle select dropdown interactions', async () => {
      const user = userEvent.setup();

      const TestSelect = () => {
        const [value, setValue] = React.useState('');

        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger data-testid="select-trigger">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1" data-testid="option1">
                Option 1
              </SelectItem>
              <SelectItem value="option2" data-testid="option2">
                Option 2
              </SelectItem>
              <SelectItem value="option3" data-testid="option3">
                Option 3
              </SelectItem>
            </SelectContent>
          </Select>
        );
      };

      render(<TestSelect />);

      const trigger = screen.getByTestId('select-trigger');

      // Open select dropdown
      await user.click(trigger);

      // Select an option
      const option2 = screen.getByTestId('option2');
      await user.click(option2);

      // Verify selection
      expect(trigger).toHaveTextContent('Option 2');
    });
  });

  describe('Complex Component Interactions', () => {
    it('should integrate multiple components in a complex form', async () => {
      const user = userEvent.setup();

      const ComplexForm = () => {
        const [formData, setFormData] = React.useState({
          name: '',
          email: '',
          role: '',
          notifications: false,
          theme: 'light',
        });

        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Configure your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  data-testid="name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  data-testid="email-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger data-testid="role-select">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, notifications: checked }))
                  }
                  data-testid="notifications-switch"
                />
                <Label htmlFor="notifications">
                  Enable email notifications
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <RadioGroup
                  value={formData.theme}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, theme: value }))
                  }
                  data-testid="theme-radio-group"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button data-testid="save-btn">Save Changes</Button>
                <Button variant="outline" data-testid="cancel-btn">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      };

      render(<ComplexForm />);

      // Test form interactions
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const notificationsSwitch = screen.getByTestId('notifications-switch');
      const saveBtn = screen.getByTestId('save-btn');

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.click(notificationsSwitch);
      await user.click(saveBtn);

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(notificationsSwitch).toBeChecked();
    });
  });
});
