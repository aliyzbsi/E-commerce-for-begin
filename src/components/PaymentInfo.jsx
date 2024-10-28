import React from "react";
import { useForm } from "react-hook-form";

function PaymentInfo() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      kkNo: "",
      kartSahAdSoyad: "",
      ay: "",
      yil: "",
      cvc: "",
    },
    mode: "onChange",
  });

  const kartSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(kartSubmit)}></form>
    </div>
  );
}

export default PaymentInfo;
