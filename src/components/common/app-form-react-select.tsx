/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionMeta } from "react-select";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import SpinnerIcon from "../icons/spinner";

interface Props {
  options: Option[];
  selected?: Option[] | null;
  setSelected?: Dispatch<SetStateAction<any>>;
  placeholder: string;
  hide?: boolean;
  form?: any;
  formName?: string;
  label?: string;
  isOptionsLoading?: boolean;
  selectType: "single" | "multi";
  className?: string;
  direction?: "row" | "column";
  disabled?: boolean;
  rightActionElement?: any;

  // menuPlacement?: "top";
}

export type Option = {
  value: number | string;
  label: string;
};

const reactSelectCustomStyles = {
  control: (_provided: any, state: any) => ({
    display: "flex",
    height: "auto",
    borderRadius: "5px",
    borderColor: state.isFocused ? "#e2e8f0" : "#CED4DE",
    boxShadow: state.isFocused ? "none" : "none",
    outline: state.isFocused ? "0 0 0 2px #e2e8f0" : "none",
    outlineOffset: "15px",
    backgroundColor: "#FFFFFF",
    opacity: state.isDisabled ? "0.5" : "1",
    fontSize: "14px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f1f5f9" : "transparent",
    borderRadius: state.isFocused ? "3px" : "",
    color: state.isSelected ? "#0f172a" : "#0f172a",
    cursor: "pointer",
    margin: "4px",
    paddingBlock: "5px",
    paddingLeft: "15px",
    width: "96%",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#334155",
  }),
};

function AppFormReactSelect(props: Props) {
  // For component "memory"

  const valueRef = useRef(props.selected || []);
  valueRef.current = props.selected || [];

  const selectAllOption = { value: "*", label: "All" };
  const isSelectAllSelected = () =>
    valueRef.current.length === props.options.length &&
    props.options.length > 1;
  const isOptionSelected = (option: Option) =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  //const getOptions = () => isSelectAllSelected() ? [] : [selectAllOption, ...props.options];
  const getOptions = () =>
    props.options.length > 1 && props.selectType === "multi"
      ? [selectAllOption, ...props.options]
      : [...props.options];
  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : props.selected;

  const handleSelect = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    if (props.selectType === "multi") {
      const { action, option, removedValue } = actionMeta;
      // Reassigning for typing. Unknown by default
      const opt = option as Option;

      const removed = removedValue as Option;
      if (action === "select-option" && opt.value === selectAllOption.value) {
        props.setSelected && props.setSelected(props.options);
      } else if (
        (action === "deselect-option" && opt.value === selectAllOption.value) ||
        (action === "remove-value" && removed.value === selectAllOption.value)
      ) {
        props.setSelected && props.setSelected([]);
      } else if (
        actionMeta.action === "deselect-option" &&
        isSelectAllSelected()
      ) {
        props.setSelected &&
          props.setSelected(
            props.options.filter(({ value }) => value !== opt.value)
          );
      } else {
        props.setSelected && props.setSelected(newValue || []);
      }
    } else {
      props.setSelected && props.setSelected([newValue]);
    }
  };

  const CheckboxOption = (props: any) => (
    <div className="flex items-center space-x-2 p-1 m-1">
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        style={{ accentColor: "#0F172A" }}
        checked={props.isSelected}
        id={props.data.value}
        onChange={() => props.selectOption(props.data)}
      />
      <label>{props.label}</label>
    </div>
  );

  const SingleSelectOption = (props: any) => (
    <div
      className="flex items-center px-3 py-1 m-1 hover:bg-gray-200 rounded-md cursor-pointer"
      onClick={() => props.selectOption(props.data)}
    >
      <label>{props.label}</label>
    </div>
  );

  const MoreSelectedBadge = ({ items }: any) => {
    const style = {
      marginLeft: "auto",
      background: "#0F172A",
      borderRadius: "4px",
      fontFamily: "Open Sans",
      fontSize: "12px",
      padding: "3px",
      order: 99,
      color: "#fff",
    };

    const title = items.join(", ");
    const length = items.length;
    // const label = `+ ${length} item${length !== 1 ? "s" : ""} selected`;
    const label = `+ ${length} more`;

    return (
      <div style={style} title={title}>
        {label}
      </div>
    );
  };

  const MultiValue = ({ index, getValue, ...props }: any) => {
    const maxToShow = 3;
    const overflow = getValue()
      .slice(maxToShow)
      .map((x: any) => x.label);

    return index < maxToShow ? (
      <components.MultiValue {...props} />
    ) : index === maxToShow ? (
      <MoreSelectedBadge items={overflow} />
    ) : null;
  };

  useEffect(() => {
    // Set the default value to all options selected when the component mounts
    if (isSelectAllSelected()) {
      props.setSelected && props.setSelected(props.options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ReactSelect = ({ field }: any) => {
    return (
      <Select
        isOptionSelected={isOptionSelected}
        className={cn(
          "w-full rounded-md border border-input text-sm shadow-sm transition-colors placeholder:text-muted-foreground",
          props.className
        )}
        styles={reactSelectCustomStyles}
        closeMenuOnSelect={props.selectType === "single"}
        defaultValue={
          props.form
            ? props.selectType === "single"
              ? field.value
              : getOptions()
            : getOptions()
        }
        menuPlacement="auto"
        value={
          props.form
            ? props.selectType === "single"
              ? field.value
              : getValue()
            : getValue()
        }
        isMulti={props.selectType === "multi"}
        isSearchable
        components={{
          Option:
            props.selectType === "multi" ? CheckboxOption : SingleSelectOption,
          MultiValue: MultiValue,
          LoadingIndicator: () => (
            <SpinnerIcon
              className="mx-auto h-6 w-6 animate-spin text-[#ccc]"
              aria-hidden="true"
            />
          ),
        }}
        placeholder={props.placeholder}
        isDisabled={props.disabled}
        options={getOptions()}
        onChange={
          props.selectType === "single" && props.form
            ? field.onChange
            : handleSelect
        }
        hideSelectedOptions={props.hide ?? false}
        instanceId={props.placeholder}
        id={props.placeholder}
        isLoading={props.isOptionsLoading}
        loadingMessage={() => null}
      />
    );
  };

  if (props.form && props.formName) {
    return (
      <FormField
        control={props.form?.control || null}
        name={props?.formName}
        render={({ field }) => (
          <FormItem
            className={cn("block ", {
              "flex items-center": props.direction === "row",
            })}
          >
            <div className="flex justify-between items-center p-0 m-0">
              <FormLabel
                className={cn("w-full", {
                  "w-[40%]": props.direction === "row",
                })}
              >
                {props.label}
              </FormLabel>
              {props.rightActionElement ? (
                props.rightActionElement
              ) : (
                <div> &#8203;</div>
              )}
            </div>
            <div className="w-full">
              <FormControl>
                <ReactSelect field={field} />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "block ",
        {
          "flex items-center gap-x-2": props.direction === "row",
        },
        props.className
      )}
    >
      <Label className="text-sm block mb-2">{props.label}</Label>
      <ReactSelect />
    </div>
  );
}

export default AppFormReactSelect;
