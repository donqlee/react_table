import React from "react";
import { ButtonComponent } from "./ButtonComponent";

export default {
  title: "Atoms/ButtonComponent",
  component: ButtonComponent,
  argTypes: {
    text: { control: "text" },
    size: { control: "text" },
    onClick: { control: "" },
  },
};

const Template = (args) => <ButtonComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: "text",
  size: "small",
  onClick: "",
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: "Click",
  size: "large",
  onClick: "",
};
