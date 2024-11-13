**TLDR;** This post serves as support for a C++ to Python binding demonstrator that can be found on the corresponding open-source [git repository](https://github.com/StijnWoestenborghs/python-cpp-binding). A connection between the two programming languages combines the data science & development productivity of python with the remarkable performance of C++. The implementation includes a clean and flexible binding setup, and also compares the difference in execution time.

<br>
<hr>
<br>

*When it comes down to making a choice between Python and C++, often the type of software you are developing is the deciding factor. Take for example the interpreted language Python: The ideal choice for data analysis or research in a machine learning context. On the other hand, a compiled language such as C++ is well suited for embedded development because of its performance, speed- and resources-wise.*

<br>

*But what if you find yourself in a situation that requires the benefits of both? In this case, it could be promising to establish a direct link between the two programming languages. Python, C++ … Let’s talk!*

<br>
<div class="flex justify-center">

![python-vs-cpp-full](./blogs/python-cpp-lets-talk/python-vs-cpp-full.png)

</div>
<br>
<br>

## The right tool for the job

Although I started out as a data scientist an increasing amount of time is now dedicated to embedded development. It is very interesting to experience both sides of the story! In an environment where complex optimization algorithms are being developed for edge computing platforms with limited resources, choosing the right tech stack is just crucial. 

<br>

On one side, we want an **efficient coding environment** with **short development cycles** and **fast evaluation** & visualization of performance. Python seems to be an appropriate choice here. But on the other hand we’ll only have access to a limited amount of CPU and memory. **Execution speed** and **resource management** will be of key importance and here C++ steps up again.

<br>

There are definitely other alternatives to achieve the same goal. Consider the interpreted MATLAB (Simulink), which provides several toolboxes for lightning-fast development and can also export the code to C++ to a specific target device using the [Embedded Coder](https://www.mathworks.com/products/embedded-coder.html). Therefore, the correct tech choice will definitely also depend on many other factors, very specific to each product. Maybe the optimal solution is a combination of both?

<br>

## Performance

Let’s start by presenting the difference in execution speed. We are testing a dummy *counting_stars* function that contains a simple for loop. The performance is compared in *main.py*. Here, *counting_stars_python* is a complete python implementation while *counting_stars_cpp* runs with a C++ backend and the established binding to Python.

```
value_out, done = counting_stars_python(value, n)
value_out, done = counting_stars_cpp(value, n)
```

Note that both functions have a completely identical python signature. When running the comparison (e.g. in docker) 
```
docker compose build binding
docker compose up binding
```

We can see that, for this example, the function is a factor 33 times faster with the binding!

<br>
<div class="flex justify-center">

![performance](./blogs/python-cpp-lets-talk/performance.png)

</div>
<br>
<br>

## The binding explained


1. <u>The C++ source code & the binding-interface</u>

    <br>

    - **function.cpp** & **function.h** contains the core functionality.
    - **binding_interfaces.h** declares the implemented interface of the binding.
    - **binding_export.cpp** wraps the core function with a JSON-string interface.
    - **binding_export.h** exposes the function declaration for C linkage so that python ctypes can link the function declaration against your function definition. 
    - **simpleson.cpp** & **simpleson.h** a [3rd party library](https://github.com/gregjesl/simpleson) for lightweight JSON parsing & serialization.
    - **main.cpp** exists for debugging & development purposes. Here, the main function is compiled to an executable. 
    - **timer.h** contains a timing tool.

    <br>

    Note that although the binding interface is very strictly defined in *binding_interfaces.h* the actual interface is just a JSON string because of the *binding_export* wrapper. Implementation in this way is flexible towards different interfaces. Additionally, when interfaces would change during development, it doesn’t affect the binding that much.

    <br>

2. <u>Compilation & Linking</u>

    <br>

    During compilation (preprocessing, compilation & assembly), machine code is generated in the form of object files. These object files contain the compiled code (in binary form) of all available symbols. It is then up to the linker to connect the missing symbols across the different object files. The linker is what produces the final compilation output which can be either a shared object (which is similar to a DLL: dynamic load library) or an executable.

    <br>

    Without diving deeper into this. (You'll probably find a much more comprehensive and better explanation [online](https://vdemir.github.io/linux/C-Compling-and-Linking/)) Here is the docker implementation using the GCC compiler with the output being an executable and a shared object respectively:

    ```
    # build executable
    g++ -std=c++20 -o /opt/binding_cpp_root/build/bin/binding -I /opt/binding_cpp_root/include/binding /opt/binding_cpp_root/src/*.cpp
    ```

    ```
    # build shared object
    g++ -std=c++20 -o /opt/binding_cpp_root/build/lib/binding.so -fpic -shared -I /opt/binding_cpp_root/include/binding /opt/binding_cpp_root/src/*.cpp
    ```

    Note that the executable is only used for debugging & development, while the shared object is loaded in python to complete the binding.

    <br>

3. <u>Loading the DLL in python</u>

    <br>

    Finally, *run_binding.py* uses python ctypes to load the DLL. because the actual interface of the binding is a JSON string, only the string and string length of input and output needs to be defined here. For this reason, the binding doesn’t have to be adapted for a changing interface.

    ```
    libc = CDLL(path_to_dll)
    run_binding_external = libc.run_binding_external
    run_binding_external.argtypes = [c_char_p, c_int, POINTER(c_char_p), POINTER(c_int)]
    ```

    <br>

## Unit testing

For completeness, two unit tests are provided. The first one is testing the operation of the C++ binding given known input and output. The second one verifies the similarity between Python and C++ implementations. The result of the unit tests, with an associated code coverage report is given below.

<br>
<div class="flex justify-center">

![unit-tests](./blogs/python-cpp-lets-talk/unit-tests.png)

</div>
<br>
<br>

## (extra) Compiler optimizations

Note that compiler optimizations were not turned on during compilation. The reason is that in our dummy example, the compiler removes the for loop when we compile for execution speed (-O3 see table below). In this case, it takes the binding only a couple of microseconds to run. However, this does make the performance comparison basically invalid.

<br>
<div class="flex justify-center">

![compiler-optimisation](./blogs/python-cpp-lets-talk/compiler-optimisation.jpeg)

</div>
<br>

<br>
<hr>
<br>

**Recognition:**


Thanks [In The Pocket](https://www.inthepocket.com/) for the time and freedom to investigate topics. At ITP we help businesses grow by implementing intelligent technologies while maintaining a perfect balance between responsability and personal development. Better product, bigger futures :rocket:

<br>

**References:**

- *www.mathworks.com. (n.d.). Embedded Coder. [online] Available at: https://www.mathworks.com/products/embedded-coder.html [Accessed Aug. 2022].‌*

- *Eslinger, G. (2022).simpleson. [online] GitHub. Available at: https://github.com/gregjesl/simpleson [Accessed Aug. 2022].*

- *Günce (n.d.). Compile/Link a Simple C Program | Günce - Günlük Blog Yazıları. [online] vdemir.github.io. Available at: https://vdemir.github.io/linux/C-Compling-and-Linking/ [Accessed Aug. 2022].*

<br>
