import React, { useEffect, useContext, useRef } from "react";
import styled from "@emotion/styled";

import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Step from "../../components/Step";

const Wrapper = styled.div`
  .step {
    textarea {
      margin-top: 10px;
      width: 100%;
      height: calc(20px + 1.5rem * 5);
      padding: 10px 20px;
      border: 0;
      border-radius: 5px;
      background-color: #444;
      color: #fff;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      font-size: 1rem;
      line-height: 1.5rem;
      resize: none;
      overflow: hidden;
    }     
  }
`;

interface PropType {
  value: string;
  onInputChanged: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}

export default function Step1(props: PropType) {
  const progress = useContext(ProgressContext) as ProgressFlags;

  let classes = "input";
  classes += progress.hasInput ? " has-input" : "";
  classes = classes.trim();

  const input = useRef(null) as any;
  
  useEffect(() => {
    input.current.focus();
  });

  return (
    <Wrapper>
      <Step number="1" title="Enter the message you want to send here" className={classes}>
        <textarea ref={input} value={props.value} onInput={props.onInputChanged} />
      </Step>
    </Wrapper>
  );
}