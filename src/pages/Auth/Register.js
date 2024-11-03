import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "config/firebase";
import { Link } from "react-router-dom";

const { Title } = Typography;

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    let { fullName, email, password, confirmPassword } = state;

    fullName = fullName.trim();

    if (fullName.length < 3) {
      return window.toastify("Please enter your full name", "error");
    }
    if (!window.isEmail(email)) {
      return window.toastify("Please enter a valid email address", "error");
    }
    if (password.length < 6) {
      return window.toastify("Password must be atleast 6 chars.", "error");
    }
    if (confirmPassword !== password) {
      return window.toastify("Password doesn't match", "error");
    }

    setIsProcessing(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user", user);

        createUserProfile({ ...user, fullName });
      })
      .catch((error) => {
        console.error("error", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            window.toastify("Email address already in use", "error");
            break;
          default:
            window.toastify(
              "Something went wrong while creating a new user",
              "error"
            );
            break;
        }
        setIsProcessing(false);
      });
  };

  const createUserProfile = async (user) => {
    const { fullName, email, uid } = user;
    const userData = {
      fullName,
      email,
      uid,
      dateCreated: serverTimestamp(),
      emailVerified: false,
      status: "active",
      roles: ["superAdmin"],
      profilePictureUrl: "",
    };
    try {
      await setDoc(doc(firestore, "users", userData.uid), userData);
      window.toastify("A new user has been successfully registered", "success");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="auth">
      <div className="card p-3 p-md-4 w-100">
        <Title level={2} className="text-center">
          Register
        </Title>

        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                size="large"
                type="text"
                placeholder="Enter your full name"
                name="fullName"
                value={state.fullName}
                onChange={handleChange}
              />
            </Col>
            <Col span={24}>
              <Input
                size="large"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={state.email}
                onChange={handleChange}
              />
            </Col>
            <Col span={24}>
              <Input.Password
                size="large"
                placeholder="Enter your password"
                name="password"
                value={state.password}
                onChange={handleChange}
              />
            </Col>
            <Col span={24}>
              <Input.Password
                size="large"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
              />
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={isProcessing}
                onClick={handleSubmit}
                style={{ backgroundColor: "#245544" }}
              >
                Register
              </Button>
              <p>
                Already have an account? <Link to={"/auth/login"}>Login</Link>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
}
