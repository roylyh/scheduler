import React from "react";

import { render, cleanup, waitForElement,fireEvent } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });;
  });
})

// xit or test.skip or it.skip to avoid running this test
// it.skip("renders without crashing", () => {
//   render(<Application />);
// });


