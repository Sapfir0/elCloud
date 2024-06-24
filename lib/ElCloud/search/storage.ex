defmodule ElCloud.Search.Helper do
  @moduledoc """
  The Store context.
  """
  import Ecto.Query, warn: false
  @data_dir Application.get_env(:elCloud, ElCloudWeb.FileStorageController)[:data_dir]
  @indexes_file Application.get_env(:elCloud, ElCloud.Search.Helper)[:indexes_file]

  @spec not_indexed_search(String.t(), String.t()) :: [String.t()]
  def not_indexed_search(directory, query_filename) do
    recursive_search(query_filename, directory)
  end

  @spec indexed_search(String.t(), String.t()) :: [String.t()]
  def indexed_search(directory, query_filename) do
    File.read!(@indexes_file)
    |> Poison.decode!()
    |> walk_by_indexed_files(query_filename)

  end

  def walk_by_indexed_files(files, query_filename) do
    fixed_files = files
    |> Enum.map(fn file ->
      if (file["children"] != nil) do
        walk_by_indexed_files(file["children"], query_filename)
      else
        IO.inspect "#{file["filename"]}"
        # %{file, "children": nil}
      end
    end)
    # IO.inspect fixed_files

    Enum.filter(fixed_files, fn file ->
        # IO.inspect file
        # String.match?(file["filename"], ~r/#{query_filename}/)
        file
    end)
  end

  def create_indexes() do
    File.write(@indexes_file,  Poison.encode!(ElCloud.FileStorage.list_files_unsafe(@data_dir)), [:binary])
  end


  def recursive_search(query_filename, directory) do
     File.ls!(directory)
      |> Enum.map(fn file -> find_in_data_dir(directory, file, query_filename) end)
      |> List.flatten()
      |> Enum.filter(fn file -> String.match?(file.filename, ~r/#{query_filename}/) end)
  end


  def find_in_data_dir(directory, filename, query_filename) do
    full_path = Path.join(directory, filename)
    is_folder = File.dir?(full_path)

    if is_folder, do: recursive_search(query_filename, full_path), else: %{
      :is_folder => is_folder,
      :filename => filename,
      :path => full_path
    } # создаем объект для всех элементов, а не только для тех, кто удовлетворяет условию, так что этот код не оч
  end



end
