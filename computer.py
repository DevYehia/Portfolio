import os
from PIL import Image

names_list = []
file_list = []

def printList():
    combined = sorted(zip(file_list, names_list))

    for itm in combined:
        print(itm)


def scan_images(root_folder, ignore_folders):
    for root, dirs, files in os.walk(root_folder):
        # Remove ignored folders from traversal
        dirs[:] = [d for d in dirs if d not in ignore_folders]

        for filename in files:
            path = os.path.join(root, filename)

            try:
                with Image.open(path) as img:
                    width, height = img.size
                    fmt = img.format
                    #print(f"{path} | {fmt} | {width}x{height}")
                    names_list.append(path)
                    file_list.append(width*height*4*1.33 / (1000 * 1000))
            except Exception:
                # Not an image or unreadable file
                pass

if __name__ == "__main__":
    folder = input("Enter root folder path: ").strip()

    # Folder NAMES to ignore (not full paths, just directory names)
    ignore = ["node_modules", ".git", "__pycache__", "venv"]

    scan_images(folder, ignore)
    printList()