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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getUserSubscriptionObject, saveTokenToCache } from "@/lib/utils";
import { useRegisterUser } from "@/services/app-survey";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/user";

const securityQuestion = {
  1: {
    eng: "What is your favorite farming tool or equipment?",
    france: "Quel est ton équipement champetre préféré",
    kirundi: "Ni ibihe bikoresho ukunda gukoresha mu murima?",
  },

  2: {
    eng: "What is the name of the crop you find most challenging to grow?",
    france:
      "Quel est le nom de la culture que vous trouvez la plus difficile à cultiver ?",
    kirundi: "Ni ikihe giterwa kibagora kurima?",
  },
};

const FormSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    phone: z.string().min(2, {
      message: "Phone must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Confirm password must be at least 2 characters.",
    }),
    cropName: z.string().min(2, {
      message: "Answer must be at least 2 characters.",
    }),
    farmingTool: z.string().min(2, {
      message: "Answer must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const RegisterUser = () => {
  const { mutateAsync: registerUser, isPending: isLoading } = useRegisterUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
      cropName: "",
      farmingTool: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const subscription = await getUserSubscriptionObject();
    const registrationBody = {
      phone: data.phone,
      password: data.password,
      username: data.username,
      cropName: data.cropName,
      farmingTool: data.farmingTool,
      subscription,
    };

    try {
      const res = await registerUser({
        body: registrationBody,
      });
      console.log("res", res);
      await saveTokenToCache(res.token);
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data as ErrorResponse;
        console.log(
          "err",
          err.errors.map((item) => item.message)
        );
      }
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(registrationBody, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Enter your phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="password" />
              </FormControl>
              <FormDescription>Enter your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cropName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{securityQuestion[1].eng}</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="farmingTool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{securityQuestion[2].eng}</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default RegisterUser;
