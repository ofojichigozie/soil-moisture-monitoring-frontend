<template>
  <div class="main">
    <div class="top">
      <div class="container">
        <div class="top-inner">
          <span style="color: #000000; font-style: italic">{{ email }}</span>
          <button class="logout-btn" v-on:click="logout()">Logout</button>
        </div>
      </div>
    </div>

    <div class="landing">
      <h1>SOIL MOISTURE MONITORING SYSTEM</h1>
      <p style="color: #ffff00">Using internet-of-things (IoT)</p>
    </div>

    <div class="main">
      <h4 class="intro">
        A web application that enables you to view soil data captured by the
        hardware-based system situated at a remote place. You can view all
        captured data or select data for a particular date.
      </h4>

      <div class="main-inner">
        <div class="form-div">
          <div class="manual-capture">
            <p>Initiate the capture of data from remote sensors</p>
            <button
              class="btn-primary btn-start"
              :style="
                isCapturing
                  ? 'background-color: grey; cursor: none;'
                  : 'background-color: #1e411b; cursor: pointer;'
              "
              :disabled="isCapturing"
              @click="startCapture"
            >
              Start
            </button>
            <button
              class="btn-danger btn-stop"
              :style="
                !isCapturing
                  ? 'background-color: grey; cursor: none;'
                  : 'background-color: rgb(158, 35, 35); cursor: pointer;'
              "
              :disabled="!isCapturing"
              @click="stopCapture"
            >
              Stop
            </button>
          </div>
          <hr />
          <p>View previously captured data</p>
          <input
            type="date"
            class="id-field"
            v-model="date"
            title="Select date"
          />
          <button
            class="btn-primary get-data-btn"
            :style="loading ? 'background-color: grey; cursor: none;' : ''"
            :disabled="loading"
            v-on:click="getEnvironmentDataByDate()"
          >
            {{ getDataButtonText }}
          </button>
          <div>
            <button
              class="btn-primary get-all-data-btn"
              :style="loading ? 'background-color: grey; cursor: none;' : ''"
              :disabled="loading"
              v-on:click="getAllEnvironmentData()"
            >
              {{ getAllDataButtonText }}
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <div v-if="isAllData == true || isAllData == false">
          <div>
            <h3 style="text-align: center; margin-top: 10px">
              {{ tagLine }}
            </h3>
          </div>

          <div style="overflow-x: auto">
            <table>
              <thead>
                <th>S/N</th>
                <th>Value (%)</th>
                <th>Capture Date</th>
                <th>Capture Time</th>
              </thead>
              <tbody>
                <tr
                  v-for="(environmentDatum, index) in environmentData"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ environmentDatum.percentage }}</td>
                  <td>{{ environmentDatum.date }}</td>
                  <td>{{ environmentDatum.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import helpers from "../helpers";

export default {
  name: "Home",

  data() {
    return {
      email: "",
      date: "",
      tagLine: "",
      isCapturing: false,
      getDataButtonText: "Get data",
      getAllDataButtonText: "Get all data",
      loading: false,
      environmentData: [],
      isAllData: null,
    };
  },

  methods: {
    startCapture: function () {
      const shouldContinue = window.confirm(
        "Please make sure the hardware system is powered on before continuing. Continue?"
      );

      if (shouldContinue) {
        this.isCapturing = true;
        helpers.startCapture();
      }
    },

    stopCapture: function () {
      this.isCapturing = false;
        helpers.stopCapture();
        alert("Stopped capture from remote sensor");
    },

    getEnvironmentDataByDate: function () {
      this.isAllData = null;
      this.loading = true;
      this.getDataButtonText = "Loading";

      if (this.date.length > 0) {
        axios
          .get(this.getUrl())
          .then((response) => {
            this.isAllData = false;
            this.environmentData = response.data.data;

            this.environmentData = this.environmentData.filter(
              (environmentDatum) =>
                environmentDatum.date ===
                new Date(this.date).toLocaleDateString()
            );

            if (this.environmentData.length == 0) {
              alert("There are no captured data for this date");
            } else {
              this.tagLine =
                "Captured data of the environment for the specified date";
            }
          })
          .catch((e) => {
            alert(e);
          })
          .finally(() => {
            window.scrollBy(0, 300);
            this.loading = false;
            this.getDataButtonText = "Get data";
          });
      } else {
        alert("Please, select date.");
      }
    },

    getAllEnvironmentData: function () {
      this.isAllData = null;
      this.loading = true;
      this.getAllDataButtonText = "Loading";

      axios
        .get(this.getUrl())
        .then((response) => {
          this.isAllData = true;
          this.environmentData = response.data.data;

          if (this.environmentData.length == 0) {
            alert("There are no captured data");
          } else {
            this.tagLine = "Captured environment data of all dates";
          }
        })
        .catch((e) => {
          alert(e);
        })
        .finally(() => {
          window.scrollBy(0, 300);
          this.loading = false;
          this.getAllDataButtonText = "Get all data";
        });
    },

    logout: function () {
      try {
        localStorage.removeItem("user");
      } catch (e) {
        // DO NOTHING
      }

      window.location.href = "/";
    },

    getUrl: function () {
      return "https://ismm-be.onrender.com/api/v1/soil-moistures";
    },
  },

  mounted() {
    this.email = localStorage.getItem("user")
      ? localStorage.getItem("user")
      : "";
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 90%;
  height: 100%;
  margin: auto;
}

.top {
  width: 100%;
  height: 80px;
  background-color: #eeeeee;
}

.btn-primary {
  background-color: #1e411b;
  color: #ffffff;
  border: none;
}

.btn-danger {
  background-color: rgb(158, 35, 35);
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  cursor: pointer;
}

.top-inner {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.logout-btn {
  background-color: rgb(158, 35, 35);
  color: #ffffff;
  padding: 8px 18px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid #ffffff;
}

.logout-btn:hover {
  cursor: pointer;
}

.landing {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  flex-flow: column;
  text-align: center;

  width: 100%;
  height: 450px;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.75) 25.62%,
      rgba(0, 0, 0, 0.75) 100%
    ),
    url("~@/assets/img/soil_moisture.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.landing h1 {
  margin-bottom: 0;
}

.landing p {
  letter-spacing: 0.2em;
}

.landing button {
  margin-top: 25px;
  border-radius: 10px;
  padding: 15px 35px;
  background-color: #1b4125;
  color: #ffffff;
  border: 0.5px solid #ffffff;
}

.main h4 {
  padding: 15px;
  color: #555555;
  width: 70%;
  margin: auto;
  margin-top: 1.5rem;
  text-align: center;
}

.form-div {
  width: 50%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #cccccc;
  border-radius: 10px;
}

.form-div input,
.form-div button {
  height: 40px;
  margin-top: 8px;
}

.form-div .id-field {
  width: 69%;
  float: left;
  padding: 10px;
}

.form-div .get-data-btn {
  width: 30%;
  float: right;
}

.form-div .get-all-data-btn {
  width: 100%;
}

.form-div .manual-capture {
  width: 100%;
  margin-bottom: 25px;
}

.form-div hr {
  height: 1px;
  background-color: rgb(226, 226, 226);
  border: none;
}

.btn-start,
.btn-stop {
  width: 49%;
}

.btn-start {
  margin-right: 2%;
}

table {
  width: 90%;
  margin: 20px auto;
}

table,
th,
tr,
td {
  border: 1px solid #444444;
  border-collapse: collapse;
}

table thead th {
  background: #5a745d;
  color: #ffffff;
  border: 1px solid #ffffff;
}

th,
td {
  padding: 8px;
}

@media screen and (max-width: 750px) {
  .landing h1,
  .landing p {
    font-size: 1.3em;
  }

  .landing p {
    letter-spacing: normal;
  }
  .main h4 {
    width: 90%;
  }

  .form-div {
    width: 90%;
  }
}
</style>