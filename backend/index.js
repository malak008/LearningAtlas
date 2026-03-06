import express from "express";
import bodyParser from "body-parser";
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const port = 3000;