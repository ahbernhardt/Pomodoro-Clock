import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import ding from "./ding.mp3";

  $(document).ready(function() {
    let workLength = 25 * 60;
    let shortBreakLength = 5 * 60;
    let longBreakLength = 15 * 60;
    let seconds = workLength;
    let initialSeconds = workLength;
    let checks = 0;
    let phaseType = 0; // 0 = work phase, 1 = break phase (both short and long)
    let countDownInterval; // interval id

    function countDown() {
      if (seconds <= 0) {
        phaseType = (phaseType + 1) % 2; // toggle between phase 0 and 1
        if (phaseType === 0) {
          $("#phase").html("Work Time");
          setTime(workLength);
          timeEndSound('ding');
        } else {
          $("#phase").html("Break Time");
          if (checks < 4) {
            //determine short or long break
            addCheck();
            timeEndSound('ding');
            setTime(shortBreakLength);
          } else {
            $("#phase").html("Long Break Time");
            timeEndSound('ding');
            clearChecks();
            setTime(longBreakLength);
          }
        }
      }
      seconds--;
      displayTime();
    }

    function startTimer() {
      if (countDownInterval) {
        return false;
      }
      countDownInterval = setInterval(countDown, 1000);
    }

    function stopTimer() {
      clearInterval(countDownInterval);
      countDownInterval = null;
    }

    function resetTimer() {
      stopTimer();
      setTime(workLength);
      clearChecks();
      displayTime();
    }

    // timer controls
    $(".start-timer").click(startTimer);
    $(".stop-timer").click(stopTimer);
    $(".reset-timer").click(resetTimer);

    // + and - buttons
    $(".length-setter").click(function() {
      const input = $(this).siblings("input");
      if ($(this).html() === "-") {
        input.val(parseInt(input.val()) - 1);
      } else if ($(this).html() === "+") {
        input.val(parseInt(input.val()) + 1);
      } else {
        // should be unreachable
      }
      validifyInput(input);
    });

    // option input events
    $("#options input[type=text]").on("input", function() {
      // prevent non-number input
      if (this.value) {
        const number = this.value.replace(/[^0-9]/g, "");
        $(this).val(number);
        validifyInput($(this));
      } else {
        $(this).val("1");
      }
    });

    function validifyInput(element) {
      // force input to be between 1 to 999
      const newValue = Math.max(1, Math.min(parseInt(element.val()), 100)) || 1;
      element.val(newValue);
      updateOptions();
    }

    function updateOptions() {
      workLength = $("input[name=work-length]").val() * 60;
      shortBreakLength = $("input[name=short-break-length]").val() * 60;
      longBreakLength = $("input[name=long-break-length]").val() * 60;
      resetTimer();
    }

    // canvas clock
    function draw() {
      const ctx = document.getElementById("timer-canvas").getContext("2d");
      // clear canvas
      ctx.clearRect(0, 0, 300, 300);
      // draw circle
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.arc(
          120,
          120,
          120,
          -0.5 * Math.PI,
          -0.5 * Math.PI +
          (initialSeconds - seconds) / initialSeconds * (2 * Math.PI)
      );
      ctx.lineTo(120, 120);
      ctx.fillStyle = "#00ffb2";
      ctx.fill();
    }

    function formatSeconds(s) {
      const minutes = Math.floor(s / 60);
      const seconds = ("00" + s % 60).slice(-2);
      return minutes + ":" + seconds;
    }

    function displayTime() {
      $("#timer").html(formatSeconds(seconds));
      draw();
    }

    function addCheck() {
      $(".check").eq(checks).css("opacity", "1.0");
      checks++;
    }

    function clearChecks() {
      $(".check").css("opacity", "");
      checks = 0;
    }

    function timeEndSound(id) {
      const ding = document.getElementById(id); // interval id
      ding.play();
    }

    function setTime(time) {
      seconds = time;
      initialSeconds = time;
    }
  }
);

class App extends Component {
  render() {
    return (
        <div id="container" className="App">
          <audio
              id="ding" src={ding}
              ref={(audio) => {
                this.timeEndSound = audio;
              }}
          />
          <div id="content">
            <div id="title" className="large">Pomodoro Timer</div>
            <div id="options">
              {/* WORK TIME */}
              <div className="timer-option">
                <div>Work Length</div>
                <button className="length-setter">-</button>
                <input type="text" name="work-length" value="25" />
                <button className="length-setter">+</button>
              </div>

              {/* SHORT BREAK */}
              <div className="timer-option">
                <div>Break Length (Short)</div>
                <button className="length-setter">-</button>
                <input type="text" name="short-break-length" value="5" />
                <button className="length-setter">+</button>
              </div>

              {/* LONG BREAK */}
              <div className="timer-option">
                <div>Break Length (Long)</div>
                <button className="length-setter">-</button>
                <input type="text" name="long-break-length" value="15" />
                <button className="length-setter">+</button>
              </div>

            </div>

            {/* CHECKS*/}
            <div id="checks">
              <span className="check"><i className="fa fa-check fa-2x" aria-hidden="true"/></span>
              <span className="check"><i className="fa fa-check fa-2x" aria-hidden="true"/></span>
              <span className="check"><i className="fa fa-check fa-2x" aria-hidden="true"/></span>
              <span className="check"><i className="fa fa-check fa-2x" aria-hidden="true"/></span>
            </div>

            <div>
              <div id="phase">
                Work Time
              </div>
              <div id="timer-container">
                <div id="timer" className="large">
                  25:00
                </div>
                <canvas id="timer-canvas" width="280" height="280"/>
              </div>
            </div>

            <div id="timer-controls">
              <button className="start-timer">Start Timer</button>
              <button className="stop-timer">Stop Timer</button>
              <button className="reset-timer">Reset Timer</button>
            </div>
          </div>
          <footer className="footer">
            <p>
              2020 ©
              <a className="footer-link" href="https://github.com/anguyen0208" target="_blank" rel="noopener noreferrer">
                anhnguyen.page
              </a>
              <span> </span>
              <span>
                Repo Link: {'  '}
                    <a className="footer-link" href="https://github.com/anguyen0208/Pomodoro-Clock" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github" />
                </a>
              </span>
            </p>
          </footer>
        </div>
    )
  }
}
export default App;

