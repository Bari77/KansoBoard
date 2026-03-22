using System.Text.Json;
using KansoBoard.Contracts.Cards;
using KansoBoard.Contracts.Projects;

namespace KansoBoard.Application.CustomFields;

public record ProjectCustomFieldStorage(
    Guid Id,
    string Label,
    ProjectCustomFieldType Type,
    bool AllowCustomValues,
    List<string> Options
);

public record CardCustomFieldValueStorage(
    Guid FieldId,
    string? TextValue,
    decimal? NumberValue
);

public static class CustomFieldJsonSerializer
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static List<ProjectCustomFieldStorage> ParseProjectFields(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];

        return JsonSerializer.Deserialize<List<ProjectCustomFieldStorage>>(json, JsonOptions) ?? [];
    }

    public static string? WriteProjectFields(IReadOnlyList<ProjectCustomFieldStorage> fields)
    {
        if (fields.Count == 0)
            return null;

        return JsonSerializer.Serialize(fields, JsonOptions);
    }

    public static List<CardCustomFieldValueStorage> ParseCardValues(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];

        return JsonSerializer.Deserialize<List<CardCustomFieldValueStorage>>(json, JsonOptions) ?? [];
    }

    public static string? WriteCardValues(IReadOnlyList<CardCustomFieldValueStorage> values)
    {
        if (values.Count == 0)
            return null;

        return JsonSerializer.Serialize(values, JsonOptions);
    }

    public static List<ProjectCustomFieldStorage> NormalizeProjectFields(IReadOnlyList<ProjectCustomFieldRequest>? fields)
    {
        if (fields is null || fields.Count == 0)
            return [];

        var normalized = new List<ProjectCustomFieldStorage>();
        var seenIds = new HashSet<Guid>();

        foreach (var field in fields)
        {
            var label = (field.Label ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(label))
                continue;

            var id = field.Id ?? Guid.NewGuid();
            if (!seenIds.Add(id))
                continue;

            var isCombo = field.Type == ProjectCustomFieldType.Combo;
            var allowCustomValues = isCombo && field.AllowCustomValues;
            var options = isCombo
                ? NormalizeOptions(field.Options)
                : [];

            normalized.Add(new ProjectCustomFieldStorage(
                id,
                label,
                field.Type,
                allowCustomValues,
                options
            ));
        }

        return normalized;
    }

    public static List<CardCustomFieldValueStorage> NormalizeCardValues(
        IReadOnlyList<CardCustomFieldValueRequest>? values,
        List<ProjectCustomFieldStorage> definitions)
    {
        if (values is null || values.Count == 0 || definitions.Count == 0)
            return [];

        var definitionById = definitions.ToDictionary(x => x.Id, x => x);
        var normalized = new List<CardCustomFieldValueStorage>();

        foreach (var value in values)
        {
            if (!definitionById.TryGetValue(value.FieldId, out var definition))
                continue;

            var text = value.TextValue?.Trim();

            switch (definition.Type)
            {
                case ProjectCustomFieldType.Text:
                    if (!string.IsNullOrWhiteSpace(text))
                        normalized.Add(new CardCustomFieldValueStorage(value.FieldId, text, null));
                    break;

                case ProjectCustomFieldType.Number:
                    if (value.NumberValue is not null)
                        normalized.Add(new CardCustomFieldValueStorage(value.FieldId, null, value.NumberValue));
                    break;

                case ProjectCustomFieldType.Combo:
                    if (string.IsNullOrWhiteSpace(text))
                        break;

                    if (definition.AllowCustomValues)
                    {
                        if (!definition.Options.Contains(text, StringComparer.OrdinalIgnoreCase))
                            definition.Options.Add(text);
                    }
                    else if (!definition.Options.Contains(text, StringComparer.OrdinalIgnoreCase))
                    {
                        throw new Exception("ERR_CARD_CUSTOM_FIELD_VALUE_INVALID");
                    }

                    normalized.Add(new CardCustomFieldValueStorage(value.FieldId, text, null));
                    break;
            }
        }

        return normalized;
    }

    public static List<ProjectCustomFieldDto> ToProjectFieldDtos(IReadOnlyList<ProjectCustomFieldStorage> fields)
        => [.. fields.Select(x => new ProjectCustomFieldDto(x.Id, x.Label, x.Type, x.AllowCustomValues, [.. x.Options]))];

    public static List<CardCustomFieldValueDto> ToCardValueDtos(IReadOnlyList<CardCustomFieldValueStorage> values)
        => [.. values.Select(x => new CardCustomFieldValueDto(x.FieldId, x.TextValue, x.NumberValue))];

    private static List<string> NormalizeOptions(IReadOnlyList<string>? options)
    {
        if (options is null || options.Count == 0)
            return [];

        var normalized = new List<string>();
        foreach (var option in options)
        {
            var value = (option ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(value))
                continue;
            if (normalized.Contains(value, StringComparer.OrdinalIgnoreCase))
                continue;
            normalized.Add(value);
        }

        return normalized;
    }
}
