import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

// GraphQL Mutation for Adding a Ticket
const ADD_TICKET = gql`
  mutation AddTicket(
    $passengerName: String!,
    $email: String!,
    $fromLocation: String!,
    $toLocation: String!,
    $date: String!,
    $journeyType: String!,
    $adults: Int!,
    $children: Int!
  ) {
    addTicket(
      passengerName: $passengerName,
      email: $email,
      fromLocation: $fromLocation,
      toLocation: $toLocation,
      date: $date,
      journeyType: $journeyType,
      adults: $adults,
      children: $children
    ) {
      id
      passengerName
    }
  }
`;

function App() {
  
  const initialFormState = {
    passengerName: "",
    email: "",
    fromLocation: "",
    toLocation: "",
    date: "",
    journeyType: "Select Journey Type",
    adults: 1,
    children: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [addTicket] = useMutation(ADD_TICKET);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTicket({ variables: { 
        ...formData, 
        adults: parseInt(formData.adults), 
        children: parseInt(formData.children) 
      } });
      alert("Ticket Booked Successfully!");
      setFormData(initialFormState);
      window.location.reload();
    } catch (error) {
      console.error("Error booking ticket:", error);
      // alert("Failed to book ticket!");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center align-items-center flex-column w-75 h-auto">
      <h2 className="text-center">Air Ticket Booking</h2>
      <form onSubmit={handleSubmit} className="p-5 align-items-center my-5 w-50 border rounded shadow">
        <div className="mb-3">
          <label className="form-label">Passenger Name</label>
          <input type="text" className="form-control" name="passengerName" value={formData.passengerName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email ID</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">From Location</label>
          <input type="text" className="form-control" name="fromLocation" value={formData.fromLocation} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">To Location</label>
          <input type="text" className="form-control" name="toLocation" value={formData.toLocation} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Journey Type</label>
          <select className="form-control" name="journeyType" value={formData.journeyType} onChange={handleChange}>
            <option value="">Select Journey Type</option>
            <option value="One Way">One Way</option>
            <option value="Round Trip">Round Trip</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Total Adults</label>
          <input type="number" className="form-control" name="adults" value={formData.adults} onChange={handleChange} min="1" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Children</label>
          <input type="number" className="form-control" name="children" value={formData.children} onChange={handleChange} min="0" />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
}

export default App;
