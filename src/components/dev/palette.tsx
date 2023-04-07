import React, {Fragment} from "react";
import {Category, Component, Palette, Variant,} from "@react-buddy/ide-toolbox-next";
import MantinePalette from "@react-buddy/palette-mantine-core";
import MantinePalette1 from "@react-buddy/palette-mantine-form";

export const PaletteTree = () => (
    <Palette>
        <Category name="App">
            <Component name="Loader">
                <Variant>
                    <ExampleLoaderComponent/>
                </Variant>
            </Component>
        </Category>
        <MantinePalette/>
        <MantinePalette1/>
    </Palette>
);

export function ExampleLoaderComponent() {
    return (
        <Fragment>Loading...</Fragment>
    );
}
