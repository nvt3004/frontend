import React, { useEffect, useRef, useState } from "react";
import { BsFillHouseAddFill } from "react-icons/bs";
import CustomButton from "../../component/CustomButton";
import Select from "react-select";
import NotSelectYet from "../../component/errorPages/NotSelectYet";
import axiosInstance from "../../../../../../services/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { Form, InputGroup, Table } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import StockProductSearch from "./StockProductSearch";

const StockIn = () => {
  return <StockProductSearch />;
};

export default StockIn;
