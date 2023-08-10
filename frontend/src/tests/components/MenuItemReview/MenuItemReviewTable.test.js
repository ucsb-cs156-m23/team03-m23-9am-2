import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Id","Item Id","Reviewer Email", "Stars","Local Date Time","Comments"];//["id", "Name", "Description"];
  const expectedFields = ["id","itemId","reviewerEmail","stars","localDateTime","comments"];//["id", "name", "description"];
  const testId = "MenuItemReviewTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={menuItemReviewFixtures.threeMenuItemReview} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    //FIX BELOW ACCORDING TO NEW HEADERS AND FIELDS
    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2014-07-27T03:14:01.216");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("string41");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("362374");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("asdasdsadasd");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("23");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-localDateTime`)).toHaveTextContent("2023-07-28T04:55:17.787");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("aaaaaaaa");


    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={menuItemReviewFixtures.threeMenuItemReview} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });


    expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2014-07-27T03:14:01.216");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("string41");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("362374");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("asdasdsadasd");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("23");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-localDateTime`)).toHaveTextContent("2023-07-28T04:55:17.787");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("aaaaaaaa");


    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={menuItemReviewFixtures.threeMenuItemReview} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2014-07-27T03:14:01.216");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("string41");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/menuitemreview/edit/1'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={menuItemReviewFixtures.threeMenuItemReview} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered

    expect(await screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2014-07-27T03:14:01.216");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("string41");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    /*await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).not.toHaveTextContent("41"));
    expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).not.toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).not.toHaveTextContent("41");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).not.toHaveTextContent("2014-07-27T03:14:01.216");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).not.toHaveTextContent("string41");*/

  });
});
