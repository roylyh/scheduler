import React from "react";
import axios from "axios";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  prettyDOM,
  getByTestId,
  queryAllByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);
// xit or test.skip or it.skip to avoid running this test
describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // await waitForElementToBeRemoved(()=>getByText(appointment, "SAVING"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the appointment with student "Archie Cohen".
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check the element with text "Are you sure you would like to delete?" is displayed.
    expect(
      getByText(appointment, /Are you sure you would like to delete?/i)
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button to delete the appointment.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check the element with text "DELETING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait until the element with the alt text "Add".
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the appointment with student "Archie Cohen".
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Change the value of Edit Component(Lydia Miller-Jones).
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 5. Click the new interviewer(Sylvia Palmer).
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click save button on the Edit component
    fireEvent.click(getByText(appointment, "Save"));
    // 7. Check the element with text "SAVING" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // 7. Wait until the element with "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // Mimics a rejected API PUT request it shows console.error in useApplicationData
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container,debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "SAVING" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    // 8. Wait until the element with the text "Error" is displayed.
    await waitForElement(() => getByText(appointment, "Could not create the appointment."));
    expect(getByText(appointment, "Error")).toBeInTheDocument()
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the appointment with student "Archie Cohen".
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check the element with text "Are you sure you would like to delete?" is displayed.
    expect(
      getByText(appointment, /Are you sure you would like to delete?/i)
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button to delete the appointment.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check the element with text "DELETING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait until the element with the text "Could not cancel the appointment.".
    await waitForElement(() => getByText(appointment, "Could not cancel the appointment."));
    expect(getByText(appointment, "Error")).toBeInTheDocument()
  });
});
