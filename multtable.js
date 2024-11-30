/*
File: multtable.js
GUI Assignment: HW4 Using the jQuery Plugin/UI with Your Dynamic Table
Part 2: jQuery UI Slider and Tab Widgets
Julian Tran, UMass Lowell Computer Science, Julian_Tran@student.uml.edu
Copyright (c) 2024 by Julian. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Created on November 25, 2024

This javascript file takes the values from the multtable.html file.
It uses the jQuery UI sliders to change the value of the text box and
dynamically change the generated multiplication table. It uses the
jQuery UI tabbed interface to place each new generated table into its
own tab. jQuery was used to create a delete button using a delete
function in order to be able to delete individual or multiple tabs.
It uses the JQuery Validation Plugin to handle errors for invalid inputs,
out of range values, and prevents the page from submitting without the
correct inputs. It uses the JQuerry library to create and call 
a function to generate the table with the four values as the parameters. 
The function creates a dynamic table with row and column headers the
appropriate results from the multiplicand and the multiplier in each cell.
*/

$(document).ready(function() {
    var tabCounter = 0;

    // Initialize sliders
    $("#colMinSlider").slider({
        min: -50,
        max: 50,
        value: $("#colMin").val(),
        slide: function(event, ui) {
            $("#colMin").val(ui.value); 
            $("#colMin").valid();
            $("#colMax").valid(); 
            if (tabCounter > 0) { 
                updateMultiplicationTable();
            }
        }
    });

    $("#colMaxSlider").slider({
        min: -50,
        max: 50,
        value: $("#colMax").val(),
        slide: function(event, ui) {
            $("#colMax").val(ui.value); 
            $("#colMax").valid();
            $('#colMin').valid(); 
            if (tabCounter > 0) { 
                updateMultiplicationTable();
            }
        }
    });

    $("#rowMinSlider").slider({
        min: -50,
        max: 50,
        value: $("#rowMin").val(),
        slide: function(event, ui) {
            $("#rowMin").val(ui.value); 
            $("#rowMin").valid(); 
            $("#rowMax").valid(); 
            if (tabCounter > 0) {
                updateMultiplicationTable();
            }
        }
    });

    $("#rowMaxSlider").slider({
        min: -50,
        max: 50,
        value: $("#rowMax").val(),
        slide: function(event, ui) {
            $("#rowMax").val(ui.value); 
            $("#rowMax").valid(); 
            $('#rowMin').valid();
            if (tabCounter > 0) {
                updateMultiplicationTable();
            }
        }
    });

    // Slider value updates when textbox value changes
    $("#colMin, #colMax, #rowMin, #rowMax").on("input", function() {
        var value = $(this).val();
        var sliderId = $(this).attr("id");

        if (!isNaN(value)) {
            $("#" + sliderId + "Slider").slider("value", value);
        }

        $(this).valid();
        updateMultiplicationTable();
    });

    // Validation rules for min > max
    $.validator.addMethod("greaterThanEqualTo", function(value, element, params) {
        return this.optional(element) || value === "" || $(params).val() === "" ||
            parseFloat(value) >= parseFloat($(params).val());
    }, "Must be greater than or equal to {0}.");

    $.validator.addMethod("lessThanEqualTo", function(value, element, params) {
        return this.optional(element) || value === "" || $(params).val() === "" ||
            parseFloat(value) <= parseFloat($(params).val());
    }, "Must be less than or equal to {0}.");

    // Validation and submit handler
    $('#numberForm').validate({
        rules: {
            colMin: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanEqualTo: "#colMax" },
            colMax: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanEqualTo: "#colMin" },
            rowMin: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanEqualTo: "#rowMax" },
            rowMax: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanEqualTo: "#rowMin" }
        },
        messages: {
            colMin: {
                required: "Please enter a value.",
                number: "Please enter a valid number.",
                min: "Minimum Column Value must be at least -50.",
                max: "Minimum Column Value must be less than 50.",
                lessThanEqualTo: "Minimum Column Value must be less than Maximum Column Value." },
            colMax: {
                required: "Please enter a value.",
                number: "Please enter a valid number.",
                min: "Maximum Column Value must be at least -50.",
                max: "Maximum Column Value must be less than 50.",
                greaterThanEqualTo: "Maximum Column Value must be greater than Minimum Column Value." },
            rowMin: {
                required: "Please enter a value.",
                number: "Please enter a valid number.",
                min: "Minimum Row Value must be at least -50.",
                max: "Minimum Row Value must be less than 50.",
                lessThanEqualTo: "Minimum Row Value must be less than Maximum Row Value." },
            rowMax: {
                required: "Please enter a value.",
                number: "Please enter a valid number.",
                min: "Maximum Row Value must be at least -50.",
                max: "Maximum Row Value must be less than 50.",
                greaterThanEqualTo: "Maximum Row Value must be greater than Minimum Row Value." }
        },
        onkeyup: function(element) {
            $(element).valid(); },
        onchange: function(element) {
            $(element).valid(); },
        submitHandler: function(form) {
            event.preventDefault();
            var colMin = $('#colMin').val();
            var colMax = $('#colMax').val();
            var rowMin = $('#rowMin').val();
            var rowMax = $('#rowMax').val();

            // Generate multiplication table and create tab
            var tabId = createTab(colMin, colMax, rowMin, rowMax);
            generateMultiplicationTable(tabId, colMin, colMax, rowMin, rowMax);
        }
    });

    // Function to create a new tab
    function createTab(minCol, maxCol, minRow, maxRow) {
        tabCounter++;

        // Generate unique tab ID and tab label
        var tabId = 'tab-' + tabCounter;
        var tabLabel = `Col: ${minCol}-${maxCol}, Row: ${minRow}-${maxRow}`;

        // Create tab element and append to tab list
        var newTab = $('<li></li>').append(
            $('<input type="checkbox">').addClass('tab-checkbox').attr('data-tab-id', tabId),
            $('<a></a>').attr('href', '#' + tabId).text(tabLabel)
        );
        $('#tabs ul').append(newTab);

        // Initialize tabs widget (or refresh)
        $('#tabs').tabs('refresh');

        // Return unique tab ID
        return tabId;
    }

    // Function to generate multiplication table inside tab
    function generateMultiplicationTable(tabId, minCol, maxCol, minRow, maxRow) {
        minCol = parseInt(minCol);
        maxCol = parseInt(maxCol);
        minRow = parseInt(minRow);
        maxRow = parseInt(maxRow);

        // Create table container inside tab
        var tableContainer = $('<div></div>').attr('id', tabId).addClass('table-container');
        
        // Create table element
        var table = $('<table></table>');
        var tbody = $('<tbody></tbody>');

        // Create header row for columns
        var colHeaders = $('<tr></tr>');
        var emptyHeader = $('<th></th>'); // Empty top-left cell
        colHeaders.append(emptyHeader);

        for (var col = minCol; col <= maxCol; col++) {
            var th = $('<th></th>').text(col);
            colHeaders.append(th);
        }
        tbody.append(colHeaders);

        // Generate table rows and cells
        for (var row = minRow; row <= maxRow; row++) {
            var tr = $('<tr></tr>');
            var rowHeader = $('<th></th>').text(row);
            tr.append(rowHeader);

            for (var col = minCol; col <= maxCol; col++) {
                var td = $('<td></td>').text(row * col);
                tr.append(td);
            }
            tbody.append(tr);
        }

        table.append(tbody);
        tableContainer.append(table);

        // Check if table container already exists for given tabId
        var existingTab = $("#" + tabId);
        if (existingTab.length) {
            // Clear existing table content before appending new table
            existingTab.empty();
            existingTab.append(tableContainer.html());
        } else {
            // Create new tab and add table inside it
            $('#tabs').append(tableContainer);
            var activeTabIndex = $('#tabs ul li').length - 1; // Index of last tab
            $('#tabs').tabs('option', 'active', activeTabIndex);
        }

        // Update tab title with current min/max values
        updateTabTitle(tabId, minCol, maxCol, minRow, maxRow);
    }

    function updateMultiplicationTable() {
        // Get current values of sliders and textboxes
        var colMin = $('#colMin').val();
        var colMax = $('#colMax').val();
        var rowMin = $('#rowMin').val();
        var rowMax = $('#rowMax').val();

        // Get ID of currently active tab
        var activeTabId = $("#tabs").tabs("option", "active");
        var activeTab = $('#tabs ul li').eq(activeTabId);
        var tabId = activeTab.find('a').attr('href').replace('#', '');

        // Call function to regenerate table inside active tab
        generateMultiplicationTable(tabId, colMin, colMax, rowMin, rowMax);
    }
    // Function to update the tab title dynamically
    function updateTabTitle(tabId, minCol, maxCol, minRow, maxRow) {
        // Find tab corresponding to provided tabId
        var tabLink = $('#tabs a[href="#' + tabId + '"]');

        // Update tab label to reflect current range
        tabLink.text(`Col: [${minCol},${maxCol}], Row: [${minRow},${maxRow}]`);
    }

    $('#deleteSelectedTabs').click(function() {
        var activeTabIndex = $('#tabs').tabs('option', 'active'); // Get current active tab index
        var deletedTabs = []; // Track deleted tab IDs
    
        // Loop through each checked tab and remove it
        $('.tab-checkbox:checked').each(function() {
            var tabId = $(this).attr('data-tab-id');
            deletedTabs.push(tabId); // Store deleted tab ID for reference
            
            // Remove corresponding tab content and tab list item
            $('#' + tabId).remove();
            $(this).closest('li').remove();
            tabCounter--;
        });
    
        // After deletion, check if active tab was removed
        if (deletedTabs.includes('tab-' + (activeTabIndex + 1))) {
            // If the currently active tab was deleted, adjust the active tab
            if ($('#tabs ul li').length > 0) {
                $('#tabs').tabs('option', 'active', 0);
            } else {
                $('#tabs').tabs('disable');
            }
        } else {
            $('#tabs').tabs('refresh');
        }
    });

    $('#tabs').tabs();
});
