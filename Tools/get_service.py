
def main(port):
    f = open("services", "r")
    lines = f.read().split("\n")
    port = "\t" + port + "/"
    for line in lines:
        if port in line:
            word = line.split("\t")[0]
            return word
    return "unknown"

