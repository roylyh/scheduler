import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import "components/Appointment/styles.scss";
import useVisualMode from "../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props.bookInterview(props.id,interview).then(()=>{
      transition(SHOW);
    }).catch(err=>{
      transition(ERROR_SAVE,true);
    });
  };

  const del = () => {
    transition(CONFIRM);
  }

  const edit = () => {
    transition(EDIT);
  }

  const onCancel = () => {
    transition(SHOW);
  }

  const onConfirm = () => {
    transition(DELETING,true);
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    }
    ).catch(err => {
      transition(ERROR_DELETE,true);
    });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            console.log("Clicked onAdd");
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={del}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && (
        <Status message={SAVING}/>
      )}
      {mode === DELETING && (
        <Status message={DELETING}/>
      )}
      {mode === CONFIRM && (
        <Confirm message="Are you sure you would like to delete?" onConfirm={onConfirm} onCancel={onCancel}/>
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not create the appointment." onClose={back}/>
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel the appointment." onClose={back} />
      )}
    </article>
  );
}
