/* eslint-disable @typescript-eslint/ban-ts-comment */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { household_eng } from "@/data/household_module/household_eng";
import { getCurrentPosition, requestGeolocationPermission } from "@/lib/utils";
import { useEffect, useState } from "react";
import { province_commune_mapping } from "@/data/household_module/province-commune-mapping";
import { commune_hill_mapping } from "@/data/household_module/commune-hill-mapping";
import { hill_subhill_mapping } from "@/data/household_module/hill-subhill-mapping";
import { all_province } from "@/data/household_module/all-province";

// const all_province = [
//   "Bubanza",
//   "Bujumbura Mairie",
//   "Bujumbura Rural",
//   "Bururi",
//   "Cankuzo",
//   "Cibitoke",
//   "Gitega",
//   "Karuzi",
//   "Kayanza",
//   "Kirundo",
//   "Makamba",
//   "Muramvya",
//   "Muyinga",
//   "Mwaro",
//   "Ngozi",
//   "Rutana",
//   "Ruyigi",
// ];

const FormSchema = z.object({
  gps: z.string().min(2, {
    message: "GPS must be at selected.",
  }),
  province: z.string().min(2, {
    message: "Province must be at selected.",
  }),
  commune: z.string().min(2, {
    message: "Commune must be at selected.",
  }),
  hill_coline: z.string().min(2, {
    message: "Hill must be at selected.",
  }),
  hill_coline_other: z.string(),
  subhill: z.string().min(2, {
    message: "Subhill must be at selected.",
  }),
  subhill_other: z.string(),
});

function AddSurvey() {
  const [provinceCommuneMappingOptions, setProvinceCommuneMappingOptions] =
    useState<string[]>();
  const [communeHillMappingOptions, setCommuneHillMappingOptions] =
    useState<string[]>();
  const [hillSubhillMappingOptions, setHillSubhillMappingOptions] =
    useState<string[]>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gps: "",
      province: "",
      commune: "",
      hill_coline: "",
      hill_coline_other: "",
      subhill: "",
      subhill_other: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const getUserLocation = async () => {
    console.log("Getting User Location :>> ");
    try {
      await requestGeolocationPermission();
      const position = await getCurrentPosition();
      const location = `${position.coords.latitude}, ${position.coords.longitude}`;
      console.log("location :>> ", location);
      console.log("position", position);
      form.setValue(
        "gps",
        `${position.coords.latitude}, ${position.coords.longitude}`
      );
    } catch (error) {
      console.log("error :>> ", error);
      if (error instanceof GeolocationPositionError) {
        if (error.code === 1) {
          alert(error.message);
        }
      }
    }
  };

  useEffect(() => {
    form.register("province", {
      required: false,
      onChange: (e) => {
        setProvinceCommuneMappingOptions(
          province_commune_mapping[e.target.value]
        );
      },
    });

    form.register("commune", {
      required: false,
      onChange: (e) => {
        setCommuneHillMappingOptions(commune_hill_mapping[e.target.value]);
      },
    });

    form.register("hill_coline", {
      required: false,
      onChange: (e) => {
        setHillSubhillMappingOptions(hill_subhill_mapping[e.target.value]);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.register]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* GPS Field */}
        <div className="flex items-center justify-start w-full">
          <FormField
            control={form.control}
            name={"gps"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{household_eng["gps"].label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={household_eng["gps"].label}
                    {...field}
                    type="text"
                    disabled
                  />
                </FormControl>
                <FormDescription>
                  {household_eng["gps"].instructions}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" className="ml-auto" onClick={getUserLocation}>
            Get Location
          </Button>
        </div>
        {/* Province Field */}
        <FormField
          control={form.control}
          name={"province"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{household_eng["province"].label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={household_eng["province"].instructions}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {all_province?.map((item) => {
                      return (
                        <SelectItem value={item.toString()} key={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>
                      {household_eng[item].instructions}
                    </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Commune Field */}
        <FormField
          control={form.control}
          name={"commune"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{household_eng["commune"].label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={household_eng["commune"].instructions}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinceCommuneMappingOptions?.map((item) => {
                      return (
                        <SelectItem value={item.toString()} key={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>
                      {household_eng[item].instructions}
                    </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Hill Field */}
        <FormField
          control={form.control}
          name={"hill_coline"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{household_eng["hill_coline"].label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={household_eng["hill_coline"].instructions}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {communeHillMappingOptions?.map((item) => {
                      return (
                        <SelectItem value={item.toString()} key={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value={"other"}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>
                      {household_eng[item].instructions}
                    </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Hill Other Field */}
        {form.getValues("hill_coline") === "other" && (
          <FormField
            control={form.control}
            name={"hill_coline_other"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {household_eng["hill_coline_other"].label}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={household_eng["hill_coline_other"].label}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {household_eng["hill_coline_other"].instructions}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* SubHill Field */}
        <FormField
          control={form.control}
          name={"subhill"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{household_eng["subhill"].label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={household_eng["subhill"].instructions}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hillSubhillMappingOptions?.map((item) => {
                      return (
                        <SelectItem value={item.toString()} key={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value={"other"}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>
                      {household_eng[item].instructions}
                    </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* SubHill Other Field */}
        {form.getValues("subhill") === "other" && (
          <FormField
            control={form.control}
            name={"subhill_other"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{household_eng["subhill_other"].label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={household_eng["subhill_other"].label}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {household_eng["subhill_other"].instructions}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>

      <p>
        {Object.keys(form.getValues()).map((item) => {
          return (
            <li key={item}>
              {/* @ts-ignore  */}
              {item} : {form.getValues()[item]}
            </li>
          );
        })}
      </p>
    </Form>
  );
}

export default AddSurvey;
