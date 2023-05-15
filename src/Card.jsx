import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import template from "./assets/template-nba.jpg";
import "./Memotest.css";

function Card({ onClick, randomPlayer, isPicked, id, found }) {
  return (
    <>
      <div className="card" onClick={found ? () => {} : onClick} id={id}>
        <img
          src={template}
          alt="template"
          className={cx("front-card", { "front-face": isPicked })}
        />
        <img
          src={randomPlayer}
          alt="player"
          className={cx("back-card", {
            "choosen-card": isPicked,
            "found-card": found,
          })}
        />
      </div>
    </>
  );
}
export default Card;

Card.propTypes = {
  onClick: PropTypes.func,
  randomPlayer: PropTypes.string,
  isPicked: PropTypes.bool,
  id: PropTypes.number,
  found: PropTypes.bool,
};
