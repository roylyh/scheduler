function getAppointmentsForDay (state, day) {
  const filtDay = state.days.filter((item)=>{return item.name === day});
  if (filtDay.length !== 0) {
    return filtDay[0].appointments.map((appointmentId) => {
      return state.appointments[appointmentId];
    }
    );
  }
  return [];
}

function getInterview(state, interview) {
  if (!interview) return null;
  return { ...interview, interviewer: state.interviewers[interview.interviewer]}
}

function getInterviewersForDay(state, day) {
  const filtDay = state.days.filter((item)=>{return item.name === day});
  if (filtDay.length !== 0) {
    return filtDay[0].interviewers.map((interviewId) => {
      return state.interviewers[interviewId];
    }
    );
  }
  return [];
}

export {getAppointmentsForDay, getInterview, getInterviewersForDay};