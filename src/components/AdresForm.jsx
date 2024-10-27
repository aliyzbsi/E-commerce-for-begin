import { useForm } from "react-hook-form";

function AdresForm({ adresInfo, setAdresInfo }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const adresSubmitFn = (data) => {
    console.log(data);
  };
  return (
    <div className="border-2 flex flex-col items-center justify-center gap-4">
      <h1>Adres</h1>
      <form action="" onSubmit={handleSubmit(adresSubmitFn)}>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col">
            <label htmlFor="firstName">
              İsim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="İsim"
              className="border-2 border-black rounded-xl p-2 px-4"
              {...register("name", {
                required: "İsim boş bırakılamaz !",
                minLength: {
                  value: 3,
                  message: "İsim 3 harften kısa olamaz!",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="surname">
              Soyisim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="surname"
              placeholder="Soyisim"
              className="border-2 border-black rounded-xl p-2 px-4"
              {...register("surname", {
                required: "Soyisim boş bırakılamaz !",
                minLength: {
                  value: 3,
                  message: "Soyisim 3 harften kısa olamaz !",
                },
              })}
            />
            {errors.surname && (
              <p className="text-red-500">{errors.surname.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdresForm;
