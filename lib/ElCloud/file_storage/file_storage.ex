defmodule ElCloud.FileStorage do
  @moduledoc """
  The FileStorage context.
  """
  import Ecto.Query, warn: false

  @spec list_files(String.t(), integer(), integer(), boolean()) :: list()
  def list_files(directory, page, page_size, is_recursive \\ false) do
    if !File.exists?(directory) do
      {:error, :folderNotFound}
    else
      DirectoryTreeHelper.list_all(directory, page, page_size, is_recursive)
    end
  end


  def list_files_unsafe(directory, page \\ 0, page_size \\ nil, is_recursive \\ true) do
    real_page_size = if page_size === nil, do: ElCloud.FileStorage.get_save_file_count(directory), else: String.to_integer(page_size)
    list_files(directory, page, real_page_size, is_recursive)
  end

  def get_save_file_count(directory) do
    files = length(File.ls!(directory))
    if files === 0, do: 1, else: files
  end

  def get_file(directory) do
    File.read(directory) # {:ok, text_in_file} | {:error, :enoent}
  end

end
