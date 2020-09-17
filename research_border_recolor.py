from PIL import Image
import numpy as np

all_unkept = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25,
              26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
              51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70,
              76, 81, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98,
              101, 102, 103, 104, 106, 107, 108, 109, 110, 116, 117, 118, 121, 122, 123,
              126, 127, 128, 129, 131, 132, 133, 134, 136, 137, 138, 139, 141, 142, 143, 144, 146, 147, 148, 149,
              151, 152, 153, 154, 156, 157, 158, 159, 161, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174,
              176, 177, 178, 179, 181, 182, 183, 184, 186, 187, 188, 189, 191, 192, 193, 194, 196, 197, 198, 199]
runes = [77, 78, 79, 80, 111, 112, 113, 114, 115]
all_kept = [x for x in range(6, 200 + 1) if x not in all_unkept]
first5 = [1, 2, 3, 4, 5]
N = 32 - 1  # the last index in an array of length 32


def read_image(path):
    try:
        image = Image.open(path)
        return image
    except Exception as e:
        print(e)
        exit(1)


def write_image(path, arr):
    try:
        image = Image.fromarray(arr)
        image.save(path)
    except Exception as e:
        print(e)
        exit(1)


def is_border(x, y):
    top = x == 0
    left = y == 0
    bottom = x == N
    right = y == N
    outer = top or left or bottom or right

    top = x == 1
    left = y == 1
    bottom = x == N - 1
    right = y == N - 1
    tl = x + y <= 5  # top left corner
    tr = x - y >= N - 5  # top right corner
    bl = y - x >= N - 5  # bottom left corner
    br = x + y >= 2 * N - 5  # bottom right corner
    inner = top or left or bottom or right or tl or tr or bl or br
    return outer, inner


def recolor(pic_ids, outer_border, inner_border):
    for i in pic_ids:
        img_path = f"../Pictures/Transparent Pics/Research{i}.png"
        img = read_image(img_path)
        arr = np.array(img)
        for px in range(32):
            for py in range(32):
                outer, inner = is_border(px, py)
                if outer:
                    arr[py, px] = outer_border
                elif inner:
                    arr[py, px] = inner_border
        out_path = f"../Pictures/Transparent Pics/Research{i}.png"
        write_image(out_path, arr)


if __name__ == '__main__':
    white = [255, 255, 255, 255]
    grey = [235, 235, 235, 255]
    recolor(all_unkept, white, grey)
    red = [237, 28, 36, 255]
    dark_red = [136, 0, 21, 255]
    # recolor(runes, red, dark_red)
    recolor(all_kept, red, dark_red)
    light_green = [181, 230, 29, 255]
    green = [92, 224, 132, 255]
    dark_green = [34, 177, 76, 255]
    recolor(first5, light_green, dark_green)
    # print(all_kept)
