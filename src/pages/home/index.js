import React from "react";
import ContactTable from "./ContactTable";
import Button from "react-bootstrap/Button";
import { Container, Col, Form, Modal, Row } from "react-bootstrap";
import {
  createContact,
  deleteContact,
  getContact,
  updateContact,
} from "../../api/index";
import Swal from "sweetalert2";

const initialValue = {
  age: undefined,
  firstName: "",
  id: "",
  lastName: "",
  photo: "N/A",
};

function HomePage() {
  const [isShowModal, setShowModal] = React.useState(false);
  const [actionType, setActionType] = React.useState("");
  const [contactData, setContactData] = React.useState(initialValue);
  const [validated, setValidated] = React.useState(false);
  const [listContact, setListContact] = React.useState([]);

  React.useEffect(() => {
    getContactAll();
  }, []);

  React.useEffect(() => {
    setValidated(false);
  }, [isShowModal]);

  const getContactAll = () => {
    getContact().then((res) => {
      console.log(res.data.data);

      setListContact(res.data.data);
      setShowModal(false);
    });
  };

  const handleEdit = (data) => {
    console.log(data);

    setContactData(data);
    setActionType("Edit");
    setShowModal(true);
  };

  const handleAdd = () => {
    setContactData(initialValue);
    setActionType("Add");
    setShowModal(true);
  };

  const handleDelete = (data) => {
    setActionType("delete");
    Swal.fire({
      title: "Are you sure you want to delete this contact?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContact(data.id)
          .then((resp) => {
            console.log(resp.data.message);
            Swal.fire("", resp.data.message, "info");
            getContactAll();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("", err.message, "error");
            getContactAll();
          });
      }
    });
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    const objectWithoutKey = (object, key) => {
      const { [key]: deletedKey, ...otherKeys } = object;
      return otherKeys;
    };

    if (form.checkValidity() === false) {
      setValidated(true);
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
      event.preventDefault();

      if (actionType === "Add") {
        createContact(objectWithoutKey(contactData, "id"))
          .then((resp) => {
            Swal.fire("Saved!", "Contact has been saved.", "info");
            getContactAll();
          })
          .catch((err) => {
            Swal.fire("", err.message, "error");
            getContactAll();
          });
      } else {
        updateContact(contactData.id, objectWithoutKey(contactData, "id"))
          .then((resp) => {
            if (resp.data.message === "Contact edited") {
              Swal.fire(resp.data.message, "", "info");
            }
            getContactAll();
          })
          .catch((err) => {
            Swal.fire("", err.message, "error");
            getContactAll();
          });
      }
    }
  };

  const handleOnChangeInput = (e) => {
    let { value } = e.target;

    if (value !== "" && value !== null) {
      setContactData({ ...contactData, [e.target.id]: value });
    } else {
      setContactData({ ...contactData, [e.target.id]: "" });
    }
  };

  const onHide = () => {
    setContactData(initialValue);
    setShowModal(false);
  };

  return (
    <Container>
      <p style={{ textAlign: "left" }}>Contact List</p>
      <Button variant="primary" size="sm" onClick={handleAdd}>
        Add New
      </Button>
      <div
        style={{
          backgroundColor: "white",
          width: window.screen.width - 200,
          padding: 5,
        }}
      ></div>
      <ContactTable
        actionType={actionType}
        data={listContact}
        setActionType={setActionType}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Modal show={isShowModal} onHide={onHide} size="lg" centered>
        <Modal.Header>
          <Modal.Title>
            {actionType === "Edit" ? "Edit Contact" : "Add New Contact"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Row>
                <Form.Label column="sm" lg={2}>
                  First Name
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    size="sm"
                    type="text"
                    placeholder="Input first name"
                    id="firstName"
                    value={contactData.firstName}
                    onChange={handleOnChangeInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    First name cannot be empty.
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column="sm" lg={2}>
                  LastName
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    size="sm"
                    type="text"
                    placeholder="Input last name"
                    id="lastName"
                    value={contactData.lastName}
                    onChange={handleOnChangeInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    Last name cannot be empty.
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column="sm" lg={2}>
                  Age
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    size="sm"
                    type="number"
                    placeholder="Input age"
                    id="age"
                    value={contactData.age}
                    onChange={handleOnChangeInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    Age cannot be empty.
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column="sm" lg={2}>
                  Photo
                </Form.Label>
                <Col>
                  <Form.Control
                    size="sm"
                    type="string"
                    placeholder="Input link photo"
                    id="photo"
                    value={contactData.photo}
                    onChange={handleOnChangeInput}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setValidated(false);
                    onHide();
                  }}
                >
                  Close
                </Button>
                {"  "}
                <Button variant="primary" size="sm" type="submit">
                  {actionType === "Edit" ? "Edit Contact" : "Add New Contact"}
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default HomePage;
