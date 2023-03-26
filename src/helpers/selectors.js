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

export {getAppointmentsForDay};