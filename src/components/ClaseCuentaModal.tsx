"use client";

import { useState, useEffect } from "react";

interface ClaseCuenta {
  codigo: string;
  nombre: string;
}

interface ClaseCuentaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClaseCuentaModal({
  isOpen,
  onClose,
}: ClaseCuentaModalProps) {
  const [formData, setFormData] = useState<ClaseCuenta>({
    codigo: "",
    nombre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(formData);
    try {
      console.log("Body que se enviará:", JSON.stringify(formData));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clase_cuenta/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      

      if (response.ok) {
        const result = await response.json();

        onClose();
      } else {
        try {
          const errorData = await response.json();
          setError(
            errorData.message ||
              "Error al crear la Clase cuenta. Inténtalo de nuevo."
          );
        } catch (parseError) {
          console.error("Error parseando respuesta:", parseError);
          setError(
            `Error del servidor (${response.status}): ${response.statusText}`
          );
        }
      }
    } catch (err) {
      console.error("Error al crear clase cuent:", err);
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Crear Clase de Cuenta
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Codigo
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Codigo de la Clase de Cuenta"
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nombre de la Clase de Cuenta"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Clase de Cuenta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
