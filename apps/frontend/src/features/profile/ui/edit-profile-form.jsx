"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProfileMutation } from "../model/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres").optional(),
  avatarSeed: z.string().optional(),
});

export function EditProfileForm({ defaultValues }) {
  const mutation = useUpdateProfileMutation();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      avatarSeed: defaultValues?.avatarSeed || "",
    },
  });

  const onSubmit = (data) => {
    // Apenas envia o que foi modificado
    const changedData = {};
    if (data.name !== defaultValues?.name) changedData.name = data.name;
    if (data.avatarSeed !== defaultValues?.avatarSeed) changedData.avatarSeed = data.avatarSeed;
    
    if (Object.keys(changedData).length > 0) {
      mutation.mutate(changedData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome de Usuário</Label>
        <Input
          id="name"
          placeholder="Seu nome"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarSeed">Avatar Seed (Customizar avatar)</Label>
        <Input
          id="avatarSeed"
          placeholder="ex: Isaac123"
          {...form.register("avatarSeed")}
        />
        <p className="text-xs text-muted-foreground">Altere o texto para gerar um avatar diferente (usando DiceBear).</p>
        {form.formState.errors.avatarSeed && (
          <p className="text-sm text-destructive">{form.formState.errors.avatarSeed.message}</p>
        )}
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
